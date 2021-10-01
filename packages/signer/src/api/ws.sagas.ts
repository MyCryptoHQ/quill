import type { ActionCreatorWithPayload, PayloadAction } from '@reduxjs/toolkit';
import type {
  JsonRPCRequest,
  JsonRPCResponse,
  JsonRPCResult,
  Permission,
  SignedJsonRPCRequest,
  UserRequest
} from '@signer/common';
import {
  denyPermission,
  getNonce,
  getPermissions,
  grantPermission,
  incrementNonce,
  JsonRPCMethod,
  requestPermission,
  safeJSONParse,
  updatePermission
} from '@signer/common';
import type { IncomingMessage } from 'http';
import type { EventChannel, SagaIterator } from 'redux-saga';
import { eventChannel } from 'redux-saga';
import { all, call, fork, put, select, take } from 'redux-saga/effects';
import WebSocket from 'ws';

import { WS_PORT } from '@config';
import {
  isValidMethod,
  isValidParams,
  isValidRequest,
  toJsonRpcResponse,
  verifyRequest
} from '@utils';

import { getWalletPermissions, requestWalletPermissions } from './permissions.sagas';
import { reply, requestAccounts, requestSignTransaction } from './ws.slice';

interface WebSocketMessage {
  socket: WebSocket;
  request: IncomingMessage;
  data: string;
}

const SUPPORTED_METHODS = {
  [JsonRPCMethod.RequestPermissions]: requestWalletPermissions,
  [JsonRPCMethod.GetPermissions]: getWalletPermissions,
  [JsonRPCMethod.SignTransaction]: requestSignTransaction,
  [JsonRPCMethod.Accounts]: requestAccounts
};

export function* webSocketSaga() {
  yield all([requestWatcherWorker()]);
}

export const createWebSocketServer = () => {
  return eventChannel<WebSocketMessage>((emitter) => {
    const server = new WebSocket.Server({ host: 'localhost', port: WS_PORT });

    server.on('connection', (socket, request) => {
      socket.on('message', (data: string) => {
        emitter({ socket, request, data });
      });
    });

    return () => {
      server.close();
    };
  });
};

export const validateRequest = (
  data: string
): [JsonRPCResponse, null] | [null, SignedJsonRPCRequest] => {
  // @todo: Further sanitation?
  const [error, request] = safeJSONParse<SignedJsonRPCRequest>(data);
  if (error) {
    return [
      toJsonRpcResponse({
        id: null,
        error: { code: '-32700', message: 'Parse error' }
      }),
      null
    ];
  }

  if (!isValidRequest(request)) {
    return [
      toJsonRpcResponse({
        id: null,
        error: { code: '-32600', message: 'Invalid request' }
      }),
      null
    ];
  }

  if (!isValidMethod(request.method)) {
    return [
      toJsonRpcResponse({
        id: request.id,
        error: { code: '-32601', message: 'Unsupported method' }
      }),
      null
    ];
  }

  if (!isValidParams(request)) {
    return [
      toJsonRpcResponse({
        id: request.id,
        error: { code: '-32602', message: 'Invalid params' }
      }),
      null
    ];
  }

  return [null, request];
};

export function* waitForResponse(id: string | number) {
  while (true) {
    const { payload }: PayloadAction<JsonRPCResult> = yield take(reply);

    if (payload.id === id) {
      return payload;
    }
  }
}

export function* waitForPermissions(permission: Permission) {
  while (true) {
    const { type, payload }: PayloadAction<Permission> = yield take([
      grantPermission,
      updatePermission,
      denyPermission
    ]);

    if (payload.origin === permission.origin && payload.publicKey === permission.publicKey) {
      return type !== denyPermission.type;
    }
  }
}

const getOriginHost = (request: IncomingMessage) => {
  try {
    return request.headers.origin && new URL(request.headers.origin).host;
  } catch {
    return null;
  }
};

/**
 * Verifies the JSON-RPC request nonce based on the ID and public key. Nonces start with 0 and must
 * be incremented by one for each subsequent request.
 *
 * The next required nonce is automatically incremented if the request nonce is valid.
 */
export function* verifyRequestNonce(
  request: JsonRPCRequest,
  publicKey: string
): SagaIterator<boolean> {
  const nonce = typeof request.id === 'string' ? parseInt(request.id, 10) : request.id;
  const expectedNonce: number = yield select(getNonce(publicKey));

  if (nonce === expectedNonce) {
    yield put(incrementNonce(publicKey));
    return true;
  }

  return false;
}

export function* handleRequest({ socket, request, data }: WebSocketMessage) {
  const [error, fullRequest] = validateRequest(data);
  if (error) {
    return socket.send(JSON.stringify(error));
  }

  const { signature, publicKey, ...jsonRpcRequest } = fullRequest;

  const origin = getOriginHost(request);
  // Dont serve requests without origin
  if (origin == null) {
    // @todo Decide what error message to use
    return socket.send(
      JSON.stringify(
        toJsonRpcResponse({
          id: jsonRpcRequest.id,
          error: { code: '-32600', message: 'Invalid request' }
        })
      )
    );
  }

  // Dont serve invalid signed requests
  const isVerified: boolean = yield call(verifyRequest, signature, jsonRpcRequest, publicKey);
  if (!isVerified) {
    // @todo Decide what error message to use
    return socket.send(
      JSON.stringify(
        toJsonRpcResponse({
          id: jsonRpcRequest.id,
          error: { code: '-32600', message: 'Invalid request' }
        })
      )
    );
  }

  // Dont serve requests with invalid nonces
  const isValidNonce: boolean = yield call(verifyRequestNonce, jsonRpcRequest, publicKey);
  if (!isValidNonce) {
    return socket.send(
      JSON.stringify(
        toJsonRpcResponse({
          id: jsonRpcRequest.id,
          error: { code: '-32600', message: 'Invalid request nonce' }
        })
      )
    );
  }

  const permissions: Permission[] = yield select(getPermissions);
  const existingPermission = permissions.find(
    (p) => p.origin === origin && p.publicKey === publicKey
  );

  if (!existingPermission) {
    const permission = { origin, publicKey };
    yield put(requestPermission(permission));

    const result: boolean = yield call(waitForPermissions, permission);
    if (!result) {
      // As per EIP-1193
      return socket.send(
        JSON.stringify(
          toJsonRpcResponse({
            id: jsonRpcRequest.id,
            error: { code: '4001', message: 'The user rejected the request' }
          })
        )
      );
    }
  }

  const method: ActionCreatorWithPayload<UserRequest> =
    SUPPORTED_METHODS[jsonRpcRequest.method as JsonRPCMethod];

  if (method) {
    yield put(method({ origin, request: jsonRpcRequest }));

    const response: JsonRPCResult = yield call(waitForResponse, jsonRpcRequest.id);
    return socket.send(JSON.stringify(toJsonRpcResponse(response)));
  }
}

export function* requestWatcherWorker() {
  const channel: EventChannel<WebSocketMessage> = yield call(createWebSocketServer);

  while (true) {
    const payload: WebSocketMessage = yield take(channel);
    yield fork(handleRequest, payload);
  }
}

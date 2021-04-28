import type { ActionCreatorWithPayload, PayloadAction } from '@reduxjs/toolkit';
import type { IncomingMessage } from 'http';
import { eventChannel } from 'redux-saga';
import { all, call, fork, put, select, take } from 'redux-saga/effects';
import WebSocket from 'ws';

import { denyPermission, getPermissions, grantPermission } from '@common/store';
import { JsonRPCMethod, WS_PORT } from '@config';
import type {
  JsonRPCRequest,
  JsonRPCResponse,
  JsonRPCResult,
  Permission,
  UserRequest
} from '@types';
import { safeJSONParse } from '@utils';

import { toJsonRpcResponse } from './utils/jsonrpc';
import { isValidMethod, isValidParams, isValidRequest } from './utils/validators';
import { reply, requestAccounts, requestPermissions, requestSignTransaction } from './ws.slice';

interface WebSocketMessage {
  socket: WebSocket;
  request: IncomingMessage;
  data: string;
}

const SUPPORTED_METHODS = {
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

export const validateRequest = (data: string): [JsonRPCResponse, null] | [null, JsonRPCRequest] => {
  // @todo: Further sanitation?
  const [error, request] = safeJSONParse<JsonRPCRequest>(data);
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
        error: { code: '-32600', message: 'Invalid Request' }
      }),
      null
    ];
  }

  if (!isValidMethod(request.method)) {
    return [
      toJsonRpcResponse({
        id: request.id,
        error: { code: '-32601', message: 'Unsupported Method' }
      }),
      null
    ];
  }

  if (!isValidParams(request)) {
    return [
      toJsonRpcResponse({
        id: request.id,
        error: { code: '-32602', message: 'Invalid Params' }
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
      denyPermission
    ]);

    if (payload.uuid === permission.uuid) {
      return type === grantPermission.type;
    }
  }
}

export function* handleRequest({ socket, request, data }: WebSocketMessage) {
  const [error, jsonRpcRequest] = validateRequest(data);
  if (error) {
    return socket.send(JSON.stringify(error));
  }

  const permissions: Permission[] = yield select(getPermissions);

  // @todo: Verify this if possible
  const origin = request.headers.origin && new URL(request.headers.origin).host;
  const publicKey = 'bla'; // @todo

  // @todo: Verify public key etc
  if (!permissions.find((p) => p.origin === origin)) {
    const permission = { origin, publicKey };
    yield put(requestPermissions(permission));
    const result: boolean = yield call(waitForPermissions, permission);
    if (!result) {
      return;
    }
  }

  const method: ActionCreatorWithPayload<UserRequest> =
    SUPPORTED_METHODS[jsonRpcRequest.method as JsonRPCMethod];
  if (method) {
    yield put(method({ origin, request: jsonRpcRequest }));

    const response = yield call(waitForResponse, jsonRpcRequest.id);
    return socket.send(JSON.stringify(toJsonRpcResponse(response)));
  }
}

export function* requestWatcherWorker() {
  const channel = yield call(createWebSocketServer);

  while (true) {
    const payload: WebSocketMessage = yield take(channel);
    yield fork(handleRequest, payload);
  }
}

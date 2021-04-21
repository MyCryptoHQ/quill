import type { ActionCreatorWithPayload, PayloadAction } from '@reduxjs/toolkit';
import { createAction } from '@reduxjs/toolkit';
import type { IncomingMessage } from 'http';
import { eventChannel } from 'redux-saga';
import { all, call, fork, put, take } from 'redux-saga/effects';
import WebSocket from 'ws';

import { toJsonRpcResponse } from '@api/store/utils';
import { JsonRPCMethod, WS_PORT } from '@config';
import type {
  JsonRPCRequest,
  JsonRPCResponse,
  JsonRPCResult,
  TSignTransaction,
  UserRequest
} from '@types';
import { isValidMethod, isValidParams, isValidRequest, safeJSONParse } from '@utils';

interface WebSocketMessage {
  socket: WebSocket;
  request: IncomingMessage;
  data: string;
}

const sliceName = 'ws';

export const requestSignTransaction = createAction<UserRequest<TSignTransaction>>(
  `${sliceName}/requestSignTransaction`
);
export const requestAccounts = createAction<UserRequest>(`${sliceName}/requestAccounts`);

export const reply = createAction<JsonRPCResult>(`${sliceName}/reply`);

const SUPPORTED_METHODS = {
  [JsonRPCMethod.SignTransaction]: requestSignTransaction,
  [JsonRPCMethod.Accounts]: requestAccounts
};

export function* webSocketSaga() {
  yield all([requestWatcherWorker()]);
}

const createWebSocketServer = () => {
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

  if (!isValidParams(request, request.method)) {
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

export function* handleRequest({ socket, request, data }: WebSocketMessage) {
  const [error, jsonRpcRequest] = validateRequest(data);
  if (error) {
    return socket.send(JSON.stringify(error));
  }

  const origin = request.headers.origin && new URL(request.headers.origin).host;
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

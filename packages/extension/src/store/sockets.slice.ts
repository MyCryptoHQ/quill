import type { JsonRPCRequest } from '@quill/common';
import { signJsonRpcRequest } from '@quill/common';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createAction, createSlice } from '@reduxjs/toolkit';
import stringify from 'fast-json-stable-stringify';
import type { SagaIterator } from 'redux-saga';
import { END, eventChannel } from 'redux-saga';
import {
  all,
  call,
  delay,
  fork,
  put,
  select,
  spawn,
  take,
  takeEvery,
  takeLatest
} from 'redux-saga/effects';
import { is } from 'superstruct';

import type { JsonRpcResponse } from '../types';
import { JsonRpcResponseStruct, RelayTarget } from '../types';
import { createRandomPrivateKey, isJsonRpcError, normalizeRequest } from '../utils';
import { broadcastTransaction } from './jsonrpc.slice';
import type { ApplicationState } from './store';

export interface SocketsState {
  isConnected: boolean;
  privateKey: string;
  nonce: number;
}

const initialState: SocketsState = {
  isConnected: false,
  privateKey: '',
  nonce: 0
};

const sliceName = 'sockets';

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    setPrivateKey(state, action: PayloadAction<string>) {
      state.privateKey = action.payload;
    },
    setConnected(state, action: PayloadAction<boolean>) {
      state.isConnected = action.payload;
    },
    incrementNonce(state) {
      state.nonce++;
    },
    setNonce(state, action: PayloadAction<number>) {
      state.nonce = action.payload;
    }
  }
});

export const createPrivateKey = createAction(`${sliceName}/createPrivateKey`);

export const message = createAction<Record<string, unknown>>(`${sliceName}/message`);
export const send = createAction<JsonRPCRequest>(`${sliceName}/send`);
export const handleRequest = createAction<{ request: JsonRPCRequest; tabId: number }>(
  `${sliceName}/handleRequest`
);

export const { setPrivateKey, setConnected, incrementNonce, setNonce } = slice.actions;
export default slice;

export function* socketsSaga() {
  yield all([
    socketWorker(),
    takeLatest(createPrivateKey.type, createPrivateKeyWorker),
    takeEvery(handleRequest.type, handleRequestWorker),
    takeLatest(setConnected.type, setConnectedWorker)
  ]);
}

/**
 * Creates a new random private key to be used for signing requests.
 */
export function* createPrivateKeyWorker() {
  const privateKey: string = yield call(createRandomPrivateKey);
  yield put(setPrivateKey(privateKey));
}

export function* waitForResponse(id: string | number) {
  while (true) {
    const { payload }: ReturnType<typeof message> = yield take(message);

    if (is(payload, JsonRpcResponseStruct) && payload.id === id) {
      return payload;
    }
  }
}

/**
 * Handles JSON-RPC requests sent to Quill.
 */
export function* handleRequestWorker(
  { payload }: ReturnType<typeof handleRequest>,
  retryNonce = false
): SagaIterator {
  const state: ApplicationState = yield select((state) => state);
  // The nonce to use as JSON-RPC request ID
  const id = state.sockets.nonce;

  const normalizedRequest: JsonRPCRequest = yield call(normalizeRequest, payload.request, state);

  yield put(send({ ...normalizedRequest, id }));
  yield put(incrementNonce());

  const response: JsonRpcResponse = yield call(waitForResponse, id);
  if (isJsonRpcError(response) && !retryNonce && response.error.data?.expectedNonce) {
    yield put(setNonce(response.error.data.expectedNonce));
    yield call(handleRequestWorker, handleRequest(payload), true);
    return;
  }

  yield call(handleResponseWorker, { request: payload.request, response });

  chrome.tabs.sendMessage(payload.tabId, {
    id: response.id,
    target: RelayTarget.Content,
    data: response.result,
    error: response.error
  });
}

export function* handleResponseWorker({
  request,
  response
}: {
  request: JsonRPCRequest;
  response: JsonRpcResponse;
}) {
  if (isJsonRpcError(response)) {
    return;
  }

  if (request.method === 'eth_sendTransaction' && typeof response.result === 'string') {
    yield put(broadcastTransaction(response.result));
  }
}

// @todo Don't hardcode this
export const createConnection = (endpoint: string = 'ws://localhost:8000'): WebSocket => {
  return new WebSocket(endpoint);
};

export const createConnectionChannel = (socket: WebSocket) => {
  return eventChannel((emit) => {
    socket.addEventListener('message', (event) => {
      emit(event);
    });

    socket.addEventListener('error', (event) => {
      // @todo Handle errors
      console.error(event);
      emit(new Error('Socket error'));
    });

    socket.addEventListener('close', () => {
      emit(END);
    });

    return () => {
      socket.close();
    };
  });
};

/**
 * Signs and sends a request to the connected WebSocket server. Note that this does not verify the request object.
 */
export function* socketRequestWorker(socket: WebSocket): SagaIterator {
  while (true) {
    const { payload }: ReturnType<typeof send> = yield take(send);

    const privateKey = yield select((state: ApplicationState) => state.sockets.privateKey);
    const request = yield call(signJsonRpcRequest, privateKey, payload);

    socket.send(stringify(request));
  }
}

/**
 * Creates a websocket connection and attempts to reconnect if the connection closes.
 */
export function* socketWorker(wait?: number): SagaIterator {
  if (wait) {
    yield delay(wait);
  }

  const socket = yield call(createConnection);
  const channel = yield call(createConnectionChannel, socket);

  yield put(setConnected(true));
  yield fork(socketRequestWorker, socket);

  try {
    while (true) {
      try {
        const action: MessageEvent = yield take(channel);
        const json = JSON.parse(action.data);

        yield put(message(json));
      } catch (error) {
        yield put(setConnected(false));
        channel.close();

        yield spawn(socketWorker, 5000);
      }
    }
  } finally {
    yield put(setConnected(false));
    channel.close();

    // eslint-disable-next-line no-unsafe-finally
    yield spawn(socketWorker, 5000);
  }
}

/**
 * Changes the icon badge when connected to Quill.
 */
export function* setConnectedWorker({ payload }: ReturnType<typeof setConnected>) {
  if (payload) {
    yield call(chrome.action.setBadgeBackgroundColor, { color: '#55B6E2' });
    yield call(chrome.action.setBadgeText, { text: ' ' });
    return;
  }

  yield call(chrome.action.setBadgeText, { text: '' });
}

import { FallbackProvider, JsonRpcProvider } from '@ethersproject/providers';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createAction, createSlice } from '@reduxjs/toolkit';
import { all, call, select, takeEvery } from 'redux-saga/effects';

import type { JsonRpcRelayRequest } from '../types';
import { RelayTarget } from '../types';
import type { ApplicationState } from './store';

export interface JsonRpcState {
  network: {
    providers: string[];
    chainId: number;
  };
}

const initialState: JsonRpcState = {
  network: {
    providers: ['https://goerli.infura.io/v3/b53ee8e579c444d186a259f7f5e3f6e0'],
    chainId: 5
  }
};

const sliceName = 'jsonrpc';

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    setNetwork(state, action: PayloadAction<{ providers: string[]; chainId: number }>) {
      state.network = action.payload;
    }
  }
});

export const handleJsonRpcRequest = createAction<JsonRpcRelayRequest>(
  `${sliceName}/handleJsonRpcRequest`
);
export const broadcastTransaction = createAction<string>(`${sliceName}/broadcastTransaction`);

export const { setNetwork } = slice.actions;
export default slice;

export function* jsonRpcSaga() {
  yield all([
    takeEvery(handleJsonRpcRequest.type, handleJsonRpcRequestWorker),
    takeEvery(broadcastTransaction.type, broadcastTransactionWorker)
  ]);
}

export function* broadcastTransactionWorker({ payload }: ReturnType<typeof broadcastTransaction>) {
  const providers: string[] = yield select(
    (state: ApplicationState) => state.jsonrpc.network.providers
  );
  const provider = new FallbackProvider(providers.map((url) => new JsonRpcProvider(url)));

  yield call([provider, provider.sendTransaction], payload);
}

export function* handleJsonRpcRequestWorker({ payload }: ReturnType<typeof handleJsonRpcRequest>) {
  const providers: string[] = yield select(
    (state: ApplicationState) => state.jsonrpc.network.providers
  );
  const provider = new JsonRpcProvider(providers[0]);

  const result: unknown = yield call(
    [provider, provider.send],
    payload.request.method,
    payload.request.params ?? []
  );

  chrome.tabs.sendMessage(payload.tabId, {
    id: payload.request.id,
    target: RelayTarget.Content,
    data: result
  });
}

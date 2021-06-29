import type { PayloadAction, Slice } from '@reduxjs/toolkit';
import { createAction, createSlice } from '@reduxjs/toolkit';
import type { JsonRPCRequest } from '@signer/common';
import { all, call, takeEvery } from 'redux-saga/effects';

export interface JsonRpcState {
  network: {
    providers: string[];
    chainId: number;
  };
}

const initialState: JsonRpcState = {
  network: {
    providers: ['https://api.mycryptoapi.com/eth'],
    chainId: 1
  }
};

const sliceName = 'jsonrpc';

const slice: Slice<JsonRpcState> = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    setNetwork(state, action: PayloadAction<{ providers: string[]; chainId: number }>) {
      state.network = action.payload;
    }
  }
});

export const request = createAction<JsonRPCRequest>(`${sliceName}/request`);

export const { setNetwork } = slice.actions;
export default slice;

export function* jsonRpcSaga() {
  yield all([takeEvery(request.type, requestWorker)]);
}

export function* requestWorker({ payload }: PayloadAction<JsonRPCRequest>) {
  yield call(console.log, payload);
}

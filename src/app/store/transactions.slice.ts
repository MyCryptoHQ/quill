import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { eventChannel } from 'redux-saga';
import { all, call, put, take } from 'redux-saga/effects';

import { ipcBridgeRenderer } from '@bridge';
import { JsonRPCRequest } from '@types';

import { ApplicationState } from './store';

export const initialState = { queue: [] as JsonRPCRequest[] };

const sliceName = 'transactions';

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    enqueue(state, action: PayloadAction<JsonRPCRequest>) {
      state.queue.push(action.payload);
    },
    dequeue(state) {
      state.queue.shift();
    }
  }
});

export const { enqueue, dequeue } = slice.actions;

export default slice;

export const getCurrentTransaction = createSelector(
  (state: ApplicationState) => state.transactions,
  (transactions) => transactions.queue[0]
);

/**
 * Sagas
 */
export function* transactionsSaga() {
  yield all([transactionsWorker()]);
}

const subscribe = () => {
  return eventChannel((emitter) => {
    const unsubcribe = ipcBridgeRenderer.api.subscribeToRequests((request) => {
      // We expect this to be validated and sanitized JSON RPC request
      emitter(request);
    });

    return () => {
      unsubcribe();
    };
  });
};

export function* transactionsWorker() {
  const channel = yield call(subscribe);
  while (true) {
    const request = yield take(channel);
    yield put(enqueue(request));
  }
}

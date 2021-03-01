import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { eventChannel } from 'redux-saga';
import { all, call, put, take, takeLatest } from 'redux-saga/effects';

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

export const denyCurrentTransaction = createAction<JsonRPCRequest>(
  `${slice.name}/denyCurrentTransaction`
);

export const { enqueue, dequeue } = slice.actions;

export default slice;

export const getCurrentTransaction = createSelector(
  (state: ApplicationState) => state.transactions,
  (transactions) => transactions.queue[0]
);

export const getQueueLength = createSelector(
  (state: ApplicationState) => state.transactions.queue,
  (queue) => queue.length
);

/**
 * Sagas
 */
export function* transactionsSaga() {
  yield all([
    transactionsWorker(),
    takeLatest(denyCurrentTransaction.name, denyCurrentTransactionWorker)
  ]);
}

export const subscribe = () => {
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

// @todo Figure out how to test this
export function* transactionsWorker() {
  const channel = yield call(subscribe);
  while (true) {
    const request = yield take(channel);
    yield put(enqueue(request));
  }
}

export function* denyCurrentTransactionWorker({ payload }: PayloadAction<JsonRPCRequest>) {
  yield call(ipcBridgeRenderer.api.sendResponse, {
    id: payload.id,
    error: { code: '-32000', message: 'User denied transaction' }
  });

  yield put(dequeue());
}

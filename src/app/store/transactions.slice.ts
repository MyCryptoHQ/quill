import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import { eventChannel } from 'redux-saga';
import { all, call, put, select, take, takeLatest } from 'redux-saga/effects';

import { ipcBridgeRenderer } from '@bridge';
import { JsonRPCRequest, TSignTransaction, TxHistoryEntry, TxHistoryResult } from '@types';
import { makeTx } from '@utils';

import { ApplicationState } from './store';
import { storage } from './utils';

export const initialState = {
  queue: [] as JsonRPCRequest<TSignTransaction>[],
  history: [] as TxHistoryEntry[]
};

const sliceName = 'transactions';

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    enqueue(state, action: PayloadAction<JsonRPCRequest<TSignTransaction>>) {
      state.queue.push(action.payload);
    },
    dequeue(state) {
      state.queue.shift();
    },
    addToHistory(state, action: PayloadAction<TxHistoryEntry>) {
      state.history.push(action.payload);
    }
  }
});

export const denyCurrentTransaction = createAction(`${slice.name}/denyCurrentTransaction`);

export const { enqueue, dequeue, addToHistory } = slice.actions;

const persistConfig = {
  key: sliceName,
  keyPrefix: '',
  storage,
  serialize: false,
  deserialize: false
};

export const reducer = persistReducer(persistConfig, slice.reducer);

export default slice;

export const getQueue = createSelector(
  (state: ApplicationState) => state.transactions,
  (transactions) => transactions.queue
);

export const getCurrentTransaction = createSelector(getQueue, (queue) => queue[0]);

export const getQueueLength = createSelector(getQueue, (queue) => queue.length);

export const getTxHistory = createSelector(
  (state: ApplicationState) => state.transactions.history.sort((a,b) => b.timestamp - a.timestamp),
  (h) => h
);

/**
 * Sagas
 */
export function* transactionsSaga() {
  yield all([
    transactionsWorker(),
    takeLatest(denyCurrentTransaction.type, denyCurrentTransactionWorker)
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

export function* denyCurrentTransactionWorker() {
  const currentTx = yield select(getCurrentTransaction);

  yield call(ipcBridgeRenderer.api.sendResponse, {
    id: currentTx.id,
    error: { code: '-32000', message: 'User denied transaction' }
  });

  yield put(dequeue());

  const tx = makeTx(currentTx);

  yield put(addToHistory({ tx, timestamp: Date.now(), result: TxHistoryResult.DENIED }));
}

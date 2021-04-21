import type { PayloadAction } from '@reduxjs/toolkit';
import { createAction, createSelector, createSlice } from '@reduxjs/toolkit';

import type { ApplicationState } from '@store';
import type { TSignTransaction, TxHistoryEntry, TxQueueEntry, UserRequest } from '@types';
import { makeQueueTx } from '@utils';

export const initialState: {
  queue: TxQueueEntry[];
  history: TxHistoryEntry[];
  currentTransaction?: TxQueueEntry | TxHistoryEntry;
} = {
  queue: [],
  history: [],
  currentTransaction: undefined
};

const sliceName = 'transactions';

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    enqueue(state, action: PayloadAction<UserRequest<TSignTransaction>>) {
      state.queue.push(makeQueueTx(action.payload));
    },
    dequeue(state, action: PayloadAction<TxQueueEntry>) {
      const idx = state.queue.findIndex((q) => q.uuid === action.payload.uuid);
      state.queue.splice(idx, 1);
    },
    addToHistory(state, action: PayloadAction<TxHistoryEntry>) {
      state.history.push(action.payload);
    },
    selectTransaction(state, action: PayloadAction<TxHistoryEntry>) {
      state.currentTransaction = action.payload;
    }
  }
});

export const denyCurrentTransaction = createAction(`${slice.name}/denyCurrentTransaction`);

export const { enqueue, dequeue, addToHistory, selectTransaction } = slice.actions;

export default slice;

export const getQueue = createSelector(
  (state: ApplicationState) => state.transactions,
  (transactions) => transactions.queue
);

export const getCurrentTransaction = createSelector(
  (state: ApplicationState) => state.transactions.currentTransaction,
  (t) => t
);

export const getQueueLength = createSelector(getQueue, (queue) => queue.length);

export const getTxHistory = createSelector(
  (state: ApplicationState) => state.transactions.history,
  (h) => h
);

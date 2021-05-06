import type { BigNumberish } from '@ethersproject/bignumber';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createAction, createSelector, createSlice } from '@reduxjs/toolkit';

import type { ApplicationState } from '@store';
import type { TAddress, TxHistoryEntry, TxQueueEntry } from '@types';
import { TxResult } from '@types';
import { bigify } from '@utils';

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
    enqueue(state, action: PayloadAction<TxQueueEntry>) {
      state.queue.push(action.payload);
    },
    update(state, action: PayloadAction<TxQueueEntry>) {
      const idx = state.queue.findIndex((q) => q.uuid === action.payload.uuid);
      state.queue[idx] = action.payload;
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

export const { enqueue, dequeue, update, addToHistory, selectTransaction } = slice.actions;

export default slice;

export const getQueue = createSelector(
  (state: ApplicationState) => state.transactions,
  (transactions) => transactions.queue
);

export const getAccountQueue = (account: TAddress) =>
  createSelector(getQueue, (queue) => queue.filter((tx) => tx.tx.from === account));

export const getCurrentTransaction = createSelector(
  (state: ApplicationState) => state.transactions.currentTransaction,
  (t) => t
);

export const getQueueLength = createSelector(getQueue, (queue) => queue.length);

export const getTxHistory = createSelector(
  (state: ApplicationState) => state.transactions.history,
  (h) => h
);

export const getApprovedTransactions = createSelector(getTxHistory, (history) =>
  history.filter((h) => h.result === TxResult.APPROVED)
);

export const getAccountNonce = (account: TAddress) =>
  createSelector(
    getApprovedTransactions,
    (transactions) =>
      transactions
        .filter((h) => h.tx.from === account)
        .map((tx) => bigify(tx.tx.nonce))
        .reduce((prev, current) => (prev.gt(current) ? prev : current)) || bigify(0)
  );

export const getNoncesInQueue = (account: TAddress, nonce: BigNumberish) =>
  createSelector(
    getQueue,
    (transactions) =>
      transactions.filter((h) => h.tx.from === account && bigify(h.tx.nonce).eq(bigify(nonce)))
        .length
  );

export const hasNonceConflictInQueue = (account: TAddress, nonce: BigNumberish) =>
  createSelector(getNoncesInQueue(account, nonce), (nonces) => nonces > 1);

export const hasNonceConflict = (account: TAddress, nonce: BigNumberish) =>
  createSelector(
    getApprovedTransactions,
    (transactions) =>
      transactions.find((h) => h.tx.from === account && bigify(h.tx.nonce).eq(bigify(nonce))) !==
      undefined
  );

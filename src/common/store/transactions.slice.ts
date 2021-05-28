import type { BigNumberish } from '@ethersproject/bignumber';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createAction, createSelector, createSlice } from '@reduxjs/toolkit';

import { bigify } from '@common/utils';
import type { ApplicationState } from '@store';
import type { TAddress, TxHistoryEntry, TxQueueEntry } from '@types';
import { InfoBannerType, TxResult } from '@types';

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

export const getAccountNonce = (account: TAddress, chainId: number) =>
  createSelector(getApprovedTransactions, (transactions) =>
    transactions
      .filter((h) => h.tx.from === account && h.tx.chainId === chainId)
      .map((tx) => bigify(tx.tx.nonce))
      .reduce((prev, current) => (prev.gt(current) ? prev : current), bigify(0))
  );

export const getNoncesInQueue = createSelector(
  getQueue,
  getCurrentTransaction,
  (transactions, currentTx) =>
    transactions.filter(
      (h) =>
        h.tx.from === currentTx.tx.from &&
        h.tx.chainId === currentTx.tx.chainId &&
        bigify(h.tx.nonce).eq(bigify(currentTx.tx.nonce))
    ).length
);

export const hasNonceConflictInQueue = createSelector(getNoncesInQueue, (nonces) => nonces > 1);

export const hasNonceConflict = (account: TAddress, chainId: number, nonce: BigNumberish) =>
  createSelector(
    getApprovedTransactions,
    (transactions) =>
      transactions.find(
        (h) =>
          h.tx.from === account && h.tx.chainId === chainId && bigify(h.tx.nonce).eq(bigify(nonce))
      ) !== undefined
  );

export const hasNonceOutOfOrder = createSelector(
  getQueue,
  getCurrentTransaction,
  (transactions, currentTx) =>
    transactions.find(
      (h) =>
        h.tx.from === currentTx.tx.from &&
        h.tx.chainId === currentTx.tx.chainId &&
        bigify(h.tx.nonce).lt(bigify(currentTx.tx.nonce))
    ) !== undefined
);

export const getTransactionInfoBannerType = createSelector(
  getCurrentTransaction,
  hasNonceConflictInQueue,
  hasNonceOutOfOrder,
  (currentTx, nonceConflictInQueue, nonceOutOfOrder) => {
    const { result, adjustedNonce } = currentTx;
    if (result !== TxResult.WAITING) {
      return result;
    }

    if (nonceOutOfOrder) {
      return InfoBannerType.NONCE_OUT_OF_ORDER;
    }

    if (adjustedNonce) {
      return InfoBannerType.NONCE_ADJUSTED;
    }

    if (nonceConflictInQueue) {
      return InfoBannerType.NONCE_CONFLICT_IN_QUEUE;
    }

    return result;
  }
);

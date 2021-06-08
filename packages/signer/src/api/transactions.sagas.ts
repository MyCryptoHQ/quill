import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  Bigish,
  TSignTransaction,
  TxHistoryEntry,
  TxQueueEntry,
  UserRequest
} from '@signer/common';
import {
  addHexPrefix,
  addToHistory,
  bigify,
  denyCurrentTransaction,
  dequeue,
  enqueue,
  getAccountNonce,
  getAccountQueue,
  getCurrentTransaction,
  getLoggedIn,
  hasNonceConflict,
  makeHistoryTx,
  makeQueueTx,
  selectTransaction,
  TxResult,
  update
} from '@signer/common';
import { all, put, select, takeEvery, takeLatest } from 'redux-saga/effects';

import { reply, requestSignTransaction } from './ws.slice';

export function* transactionsSaga() {
  yield all([
    takeEvery(requestSignTransaction.type, addTransactionWorker),
    takeEvery([enqueue.type, dequeue.type, addToHistory.type], nonceConflictWorker),
    takeLatest(denyCurrentTransaction.type, denyCurrentTransactionWorker)
  ]);
}

export function* addTransactionWorker({ payload }: PayloadAction<UserRequest<TSignTransaction>>) {
  const isLoggedIn: boolean = yield select(getLoggedIn);
  if (isLoggedIn) {
    yield put(enqueue(makeQueueTx(payload)));
  }
}

export function* nonceConflictWorker({ payload }: PayloadAction<TxQueueEntry | TxHistoryEntry>) {
  const queue: TxQueueEntry[] = yield select(getAccountQueue(payload.tx.from));
  for (const item of queue) {
    // Don't run on user edited transactions
    if (item.userEdited) {
      continue;
    }

    const { nonce, from, chainId } = item.tx;

    const accountNonce: Bigish = yield select(getAccountNonce(from, chainId));
    const nonceConflict: boolean = yield select(hasNonceConflict(from, chainId, nonce));
    const nonceTooLow: boolean = bigify(nonce).lte(accountNonce);
    const changeNonce = nonceConflict || nonceTooLow;
    if (!changeNonce) {
      continue;
    }

    const newNonce = accountNonce.plus(1);

    if (!newNonce.eq(bigify(nonce))) {
      yield put(
        update({
          ...item,
          tx: { ...item.tx, nonce: addHexPrefix(newNonce.toString(16)) },
          adjustedNonce: true
        })
      );
    }
  }
}

export function* denyCurrentTransactionWorker() {
  const transaction: TxQueueEntry = yield select(getCurrentTransaction);

  yield put(
    reply({
      id: transaction.id,
      error: { code: '-32000', message: 'User denied transaction' }
    })
  );

  yield put(dequeue(transaction));

  const entry = makeHistoryTx(transaction, TxResult.DENIED);

  yield put(addToHistory(entry));
  yield put(selectTransaction(entry));
}

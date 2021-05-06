import type { PayloadAction } from '@reduxjs/toolkit';
import { all, put, select, takeEvery, takeLatest } from 'redux-saga/effects';

import {
  addToHistory,
  denyCurrentTransaction,
  dequeue,
  enqueue,
  getCurrentTransaction,
  getLoggedIn,
  hasNonceConflict,
  selectTransaction
} from '@common/store';
import { getAccountNonce, getAccountQueue, update } from '@common/store/transactions.slice';
import type { TSignTransaction, TxHistoryEntry, TxQueueEntry, UserRequest } from '@types';
import { TxResult } from '@types';
import type { Bigish } from '@utils';
import { addHexPrefix, bigify, makeHistoryTx, makeQueueTx } from '@utils';

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
    const { nonce, from } = item.tx;

    const accountNonce: Bigish = yield select(getAccountNonce(from));
    const nonceConflict: boolean = yield select(hasNonceConflict(from, nonce));
    const nonceTooLow: boolean = bigify(nonce).lte(accountNonce);
    const changeNonce = nonceConflict || nonceTooLow;
    if (!changeNonce) {
      continue;
    }

    const newNonce = changeNonce ? accountNonce.plus(1) : bigify(nonce);

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

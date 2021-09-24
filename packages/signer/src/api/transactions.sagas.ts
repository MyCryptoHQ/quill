import type { PayloadAction } from '@reduxjs/toolkit';
import type { TSignTransaction, TxQueueEntry, UserRequest } from '@signer/common';
import {
  addToHistory,
  denyCurrentTransaction,
  dequeue,
  enqueue,
  getCurrentTransaction,
  getLoggedIn,
  makeHistoryTx,
  makeQueueTx,
  selectTransaction,
  TxResult
} from '@signer/common';
import { all, put, select, takeEvery, takeLatest } from 'redux-saga/effects';

import { reply, requestSignTransaction } from './ws.slice';

export function* transactionsSaga() {
  yield all([
    takeEvery(requestSignTransaction.type, addTransactionWorker),
    takeLatest(denyCurrentTransaction.type, denyCurrentTransactionWorker)
  ]);
}

export function* addTransactionWorker({ payload }: PayloadAction<UserRequest<TSignTransaction>>) {
  const isLoggedIn: boolean = yield select(getLoggedIn);
  if (isLoggedIn) {
    yield put(enqueue(makeQueueTx(payload)));
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

import type { TSignTransaction, TxQueueEntry, UserRequest } from '@quill/common';
import {
  addToHistory,
  denyCurrentTransaction,
  dequeue,
  enqueue,
  getCurrentTransaction,
  getLoggedIn,
  getQueueLength,
  makeHistoryTx,
  makeQueueTx,
  MAX_QUEUE_LENGTH,
  selectTransaction,
  TxResult
} from '@quill/common';
import type { PayloadAction } from '@reduxjs/toolkit';
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
  const queueLength: number = yield select(getQueueLength);
  if (queueLength >= MAX_QUEUE_LENGTH) {
    yield put(
      reply({
        id: payload.request.id,
        // @todo Decide what error message to use
        error: { code: '-32600', message: 'Invalid request' }
      })
    );
    return;
  }
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

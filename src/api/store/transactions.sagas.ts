import type { PayloadAction } from '@reduxjs/toolkit';
import { all, put, select, takeEvery, takeLatest } from 'redux-saga/effects';

import {
  addToHistory,
  denyCurrentTransaction,
  dequeue,
  enqueue,
  getCurrentTransaction,
  selectTransaction
} from '@common/store';
import type { ApplicationState } from '@store';
import type { TSignTransaction, UserRequest } from '@types';
import { TxResult } from '@types';
import { makeHistoryTx } from '@utils';

import { reply, requestSignTransaction } from './ws.sagas';

export function* transactionsSaga() {
  yield all([
    takeEvery(requestSignTransaction.type, addTransactionWorker),
    takeLatest(denyCurrentTransaction.type, denyCurrentTransactionWorker)
  ]);
}

export function* addTransactionWorker({ payload }: PayloadAction<UserRequest<TSignTransaction>>) {
  const isLoggedIn: boolean = yield select((state: ApplicationState) => state.auth.loggedIn);
  if (isLoggedIn) {
    yield put(enqueue(payload));
  }
}

export function* denyCurrentTransactionWorker() {
  const transaction = yield select(getCurrentTransaction);

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

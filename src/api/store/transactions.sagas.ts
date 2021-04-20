import type { PayloadAction } from '@reduxjs/toolkit';
import { ipcMain } from 'electron';
import { all, call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';

import {
  addToHistory,
  addTransaction,
  denyCurrentTransaction,
  dequeue,
  enqueue,
  getCurrentTransaction,
  selectTransaction
} from '@common/store';
import { IPC_CHANNELS } from '@config';
import type { ApplicationState } from '@store';
import type { TSignTransaction, UserRequest } from '@types';
import { TxResult } from '@types';
import { makeHistoryTx } from '@utils';

export function* transactionsSaga() {
  yield all([
    takeEvery(addTransaction.type, addTransactionWorker),
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
  const currentTx = yield select(getCurrentTransaction);

  yield call(ipcMain.emit, IPC_CHANNELS.API, {
    id: currentTx.id,
    error: { code: '-32000', message: 'User denied transaction' }
  });

  yield put(dequeue(currentTx));

  const txEntry = makeHistoryTx(currentTx, TxResult.DENIED);

  yield put(addToHistory(txEntry));
  yield put(selectTransaction(txEntry));
}

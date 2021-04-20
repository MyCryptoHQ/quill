import type { TransactionRequest } from '@ethersproject/abstract-provider';
import { parse } from '@ethersproject/transactions';
import type { PayloadAction } from '@reduxjs/toolkit';
import { push } from 'connected-react-router';
import { ipcMain } from 'electron';
import { call, put, select, takeLatest } from 'redux-saga/effects';

import { signTransaction } from '@api/crypto';
import {
  addToHistory,
  dequeue,
  getCurrentTransaction,
  selectTransaction,
  sign
} from '@common/store';
import { signFailed, signSuccess } from '@common/store/signing.slice';
import { IPC_CHANNELS } from '@config';
import { ROUTE_PATHS } from '@routing';
import type { SerializedPersistentAccount, SerializedWallet } from '@types';
import { TxResult } from '@types';
import { makeHistoryTx } from '@utils';

export function* signingSaga() {
  yield takeLatest(sign.type, signWorker);
}

export function* signWorker({
  payload: { wallet, tx }
}: PayloadAction<{
  wallet: SerializedWallet | SerializedPersistentAccount;
  tx: TransactionRequest;
}>) {
  try {
    const signedTx: string = yield call(signTransaction, wallet, tx);

    yield put(signSuccess());

    const currentTx = yield select(getCurrentTransaction);

    ipcMain.emit(IPC_CHANNELS.API, { id: currentTx.id, result: signedTx });

    yield put(dequeue(currentTx));

    const parsedTx = parse(signedTx);
    const txEntry = makeHistoryTx(currentTx, TxResult.APPROVED, parsedTx);

    yield put(addToHistory(txEntry));
    yield put(selectTransaction(txEntry));
    yield put(push(ROUTE_PATHS.TX));
  } catch (err) {
    yield put(signFailed(err.message));
  }
}

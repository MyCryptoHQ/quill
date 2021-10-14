import type { TransactionRequest } from '@ethersproject/abstract-provider';
import {
  addToHistory,
  dequeue,
  getCurrentTransaction,
  makeHistoryTx,
  selectTransaction,
  sign,
  signFailed,
  signSuccess,
  TxResult
} from '@quill/common';
import type { SerializedPersistentAccount, SerializedWallet, TxQueueEntry } from '@quill/common';
import type { PayloadAction } from '@reduxjs/toolkit';
import { push } from 'connected-react-router';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import { reply } from '@api/ws.slice';
import { ROUTE_PATHS } from '@routing';

import { signTransaction } from './crypto';

export function* signingSaga() {
  yield all([takeLatest(sign.type, signWorker)]);
}

export function* signWorker({
  payload: { wallet, tx }
}: PayloadAction<{
  wallet: SerializedWallet | SerializedPersistentAccount;
  tx: TransactionRequest;
}>) {
  try {
    const transaction: TxQueueEntry = yield select(getCurrentTransaction);
    const signedTransaction: string = yield call(signTransaction, wallet, tx);

    if (!transaction.offline) {
      yield put(
        reply({
          id: transaction.id,
          result: signedTransaction
        })
      );
    }

    yield put(signSuccess());
    yield put(dequeue(transaction));

    const txEntry = makeHistoryTx(transaction, TxResult.APPROVED, signedTransaction);

    yield put(addToHistory(txEntry));
    yield put(selectTransaction(txEntry));
    yield put(push(ROUTE_PATHS.TX));
  } catch (err) {
    yield put(signFailed(err.message));
  }
}

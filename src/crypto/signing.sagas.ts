import type { TransactionRequest } from '@ethersproject/abstract-provider';
import type { PayloadAction } from '@reduxjs/toolkit';
import { push } from 'connected-react-router';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import { reply } from '@api/ws.slice';
import {
  addToHistory,
  dequeue,
  getCurrentTransaction,
  selectTransaction,
  sign
} from '@common/store';
import { signFailed, signSuccess } from '@common/store/signing.slice';
import { makeHistoryTx } from '@common/utils';
import { ROUTE_PATHS } from '@routing';
import type { SerializedPersistentAccount, SerializedWallet, TxQueueEntry } from '@types';
import { TxResult } from '@types';

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

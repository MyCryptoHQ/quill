import type { TransactionRequest } from '@ethersproject/abstract-provider';
import { parse } from '@ethersproject/transactions';
import type { PayloadAction } from '@reduxjs/toolkit';
import { push } from 'connected-react-router';
import { call, put, select, takeLatest } from 'redux-saga/effects';

import { signTransaction } from '@api/crypto';
import { reply } from '@api/store/ws.sagas';
import {
  addToHistory,
  dequeue,
  getCurrentTransaction,
  selectTransaction,
  sign
} from '@common/store';
import { signFailed, signSuccess } from '@common/store/signing.slice';
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
    const transaction = yield select(getCurrentTransaction);
    const signedTransaction: string = yield call(signTransaction, wallet, tx);

    yield put(
      reply({
        id: transaction.id,
        result: signedTransaction
      })
    );

    yield put(signSuccess());
    yield put(dequeue(transaction));

    const parsedTx = parse(signedTransaction);
    const txEntry = makeHistoryTx(transaction, TxResult.APPROVED, parsedTx);

    yield put(addToHistory(txEntry));
    yield put(selectTransaction(txEntry));
    yield put(push(ROUTE_PATHS.TX));
  } catch (err) {
    yield put(signFailed(err.message));
  }
}

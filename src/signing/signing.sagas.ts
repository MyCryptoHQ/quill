import type { TransactionRequest } from '@ethersproject/abstract-provider';
import { parse } from '@ethersproject/transactions';
import { PrivateKey } from '@mycrypto/wallets';
import type { PayloadAction } from '@reduxjs/toolkit';
import { getWallet } from '@wallets/wallet-initialisation';
import { push } from 'connected-react-router';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import { reply } from '@api/store/ws.slice';
import {
  addToHistory,
  dequeue,
  getCurrentTransaction,
  selectTransaction,
  sign
} from '@common/store';
import { init, signFailed, signSuccess } from '@common/store/signing.slice';
import { ROUTE_PATHS } from '@routing';
import type {
  SerializedOptionalPersistentWallet,
  SerializedPersistentAccount,
  SerializedWallet,
  TUuid
} from '@types';
import { TxResult } from '@types';
import { makeHistoryTx } from '@utils';

import { getPrivateKey, init as initFn } from './secrets';

export function* signingSaga() {
  yield all([takeLatest(sign.type, signWorker), takeLatest(init.type, initWorker)]);
}

const getPersistentWallet = async (uuid: TUuid): Promise<PrivateKey> => {
  const privateKey = await getPrivateKey(uuid);
  if (privateKey == null) {
    throw new Error('Saved Private Key is invalid');
  }
  return new PrivateKey(privateKey);
};

export const signTransaction = async (
  wallet: SerializedOptionalPersistentWallet,
  tx: TransactionRequest
) => {
  const initialisedWallet = wallet.persistent
    ? await getPersistentWallet(wallet.uuid)
    : await getWallet(wallet as SerializedWallet);
  return initialisedWallet.signTransaction(tx);
};

export function* initWorker({ payload }: PayloadAction<string>) {
  yield call(initFn, payload);
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

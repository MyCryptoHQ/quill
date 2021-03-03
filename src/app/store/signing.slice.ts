import { TransactionRequest } from '@ethersproject/abstract-provider';
import { parse } from '@ethersproject/transactions';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { call, put, select, takeLatest } from 'redux-saga/effects';

import { ipcBridgeRenderer } from '@bridge';
import {
  CryptoRequestType,
  InitialisePersistentAccount,
  SerializedWallet,
  TxHistoryResult
} from '@types';

import { addToHistory, dequeue, getCurrentTransaction } from './transactions.slice';

export const initialState = { isSigning: false };

const sliceName = 'signing';

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    sign(
      state,
      _: PayloadAction<{
        wallet: SerializedWallet | InitialisePersistentAccount;
        tx: TransactionRequest;
      }>
    ) {
      state.isSigning = true;
    },
    signSuccess(state) {
      state.isSigning = false;
    }
  }
});

export const { sign, signSuccess } = slice.actions;

export default slice;

/**
 * Sagas
 */
export function* signingSaga() {
  yield takeLatest(sign.type, signWorker);
}

export function* signWorker({
  payload: { wallet, tx }
}: PayloadAction<{
  wallet: SerializedWallet | InitialisePersistentAccount;
  tx: TransactionRequest;
}>) {
  const signedTx: string = yield call(ipcBridgeRenderer.crypto.invoke, {
    type: CryptoRequestType.SIGN,
    wallet,
    tx
  });

  yield put(signSuccess());

  const currentTx = yield select(getCurrentTransaction);

  yield call(ipcBridgeRenderer.api.sendResponse, { id: currentTx.id, result: signedTx });

  yield put(dequeue());

  const parsedTx = parse(signedTx);

  yield put(
    addToHistory({
      tx,
      signedTx: parsedTx,
      timestamp: Date.now(),
      result: TxHistoryResult.APPROVED
    })
  );
}

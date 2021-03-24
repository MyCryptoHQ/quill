import { TransactionRequest } from '@ethersproject/abstract-provider';
import { parse } from '@ethersproject/transactions';
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { push } from 'connected-react-router';
import { call, put, select, takeLatest } from 'redux-saga/effects';

import { ROUTE_PATHS } from '@app/routing';
import { ipcBridgeRenderer } from '@bridge';
import { CryptoRequestType, SerializedPersistentAccount, SerializedWallet, TxResult } from '@types';
import { makeHistoryTx } from '@utils';

import { ApplicationState } from './store';
import {
  addToHistory,
  dequeue,
  getCurrentTransaction,
  selectTransaction
} from './transactions.slice';

export const initialState = { isSigning: false, error: undefined as string | undefined };

const sliceName = 'signing';

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    sign(
      state,
      _: PayloadAction<{
        wallet: SerializedWallet | SerializedPersistentAccount;
        tx: TransactionRequest;
      }>
    ) {
      state.isSigning = true;
    },
    signSuccess(state) {
      state.isSigning = false;
      state.error = undefined;
    },
    signFailed(state, action: PayloadAction<string>) {
      state.isSigning = false;
      state.error = action.payload;
    }
  }
});

export const { sign, signSuccess, signFailed } = slice.actions;

export default slice;

export const getError = createSelector(
  (state: ApplicationState) => state.signing,
  (signing) => signing.error
);

/**
 * Sagas
 */
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
    const signedTx: string = yield call(ipcBridgeRenderer.crypto.invoke, {
      type: CryptoRequestType.SIGN,
      wallet,
      tx
    });

    yield put(signSuccess());

    const currentTx = yield select(getCurrentTransaction);

    yield call(ipcBridgeRenderer.api.sendResponse, { id: currentTx.id, result: signedTx });

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

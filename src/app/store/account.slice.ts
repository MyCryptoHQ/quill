import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import { all, call, put, takeLatest } from 'redux-saga/effects';

import { ipcBridgeRenderer } from '@bridge';
import {
  CryptoRequestType,
  DBRequestType,
  IAccount,
  InitialiseMnemonicPhrase,
  SerializedWallet,
  TAddress
} from '@types';
import { generateDeterministicAddressUUID } from '@utils';

import { ApplicationState } from './store';
import { storage } from './utils';

export const initialState = { accounts: [] as IAccount[], isFetching: false };

const sliceName = 'accounts';

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    addAccount(state, action: PayloadAction<IAccount>) {
      state.accounts.push(action.payload);
      state.isFetching = false;
    },
    removeAccount(state, action: PayloadAction<IAccount>) {
      const idx = state.accounts.findIndex((a) => a.uuid === action.payload.uuid);
      state.accounts.splice(idx, 1);
    },
    fetchAccount(state, _: PayloadAction<SerializedWallet & { persistent: boolean }>) {
      state.isFetching = true;
    }
  }
});

export const { addAccount, removeAccount, fetchAccount } = slice.actions;

export default slice;

const persistConfig = {
  key: sliceName,
  keyPrefix: '',
  storage,
  serialize: false,
  deserialize: false
};

export const reducer = persistReducer(persistConfig, slice.reducer);

export const getAccounts = createSelector(
  (state: ApplicationState) => state.accounts,
  (accounts) => accounts.accounts
);

/**
 * Sagas
 */
export function* accountsSaga() {
  yield all([
    takeLatest(fetchAccount.type, fetchAccountWorker),
    takeLatest(removeAccount.type, removeAccountWorker)
  ]);
}

export function* fetchAccountWorker({ payload: wallet }: PayloadAction<SerializedWallet & { persistent: boolean }>) {
  const address: TAddress = yield call(ipcBridgeRenderer.crypto.invoke, {
    type: CryptoRequestType.GET_ADDRESS,
    wallet
  });

  const uuid = generateDeterministicAddressUUID(address);

  if (wallet.persistent) {
    yield call(ipcBridgeRenderer.db.invoke, {
      type: DBRequestType.SAVE_ACCOUNT_SECRETS,
      wallet
    })
  }

  yield put(
    addAccount({
      type: wallet.walletType,
      address,
      uuid,
      dPath: (wallet as InitialiseMnemonicPhrase).path,
      persistent: wallet.persistent
    })
  );
}

export function* removeAccountWorker({ payload: account }: PayloadAction<IAccount>) {
  if (account.persistent) {
    yield call(ipcBridgeRenderer.db.invoke, {
      type: DBRequestType.DELETE_ACCOUNT_SECRETS,
      uuid: account.uuid
    });
  }
}

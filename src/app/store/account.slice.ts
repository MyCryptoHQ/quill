import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { replace } from 'connected-react-router';
import { persistReducer } from 'redux-persist';
import { all, call, put, takeLatest } from 'redux-saga/effects';

import { ROUTE_PATHS } from '@app/routing';
import { ipcBridgeRenderer } from '@bridge';
import {
  CryptoRequestType,
  DBRequestType,
  IAccount,
  SerializedMnemonicPhrase,
  SerializedWallet,
  TAddress
} from '@types';
import { generateDeterministicAddressUUID } from '@utils';

import { ApplicationState } from './store';
import { storage } from './utils';

export interface AccountsState {
  accounts: IAccount[];
  isFetching: boolean;
  fetchError?: string;
}

export const initialState: AccountsState = {
  accounts: [],
  isFetching: false
};

const sliceName = 'accounts';

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    addAccount(state, action: PayloadAction<IAccount>) {
      state.accounts.push(action.payload);
      state.fetchError = undefined;
      state.isFetching = false;
    },
    removeAccount(state, action: PayloadAction<IAccount>) {
      const idx = state.accounts.findIndex((a) => a.uuid === action.payload.uuid);
      state.accounts.splice(idx, 1);
    },
    fetchAccount(state, _: PayloadAction<SerializedWallet & { persistent: boolean }>) {
      state.isFetching = true;
    },
    fetchFailed(state, action: PayloadAction<string>) {
      state.fetchError = action.payload;
    }
  }
});

export const { addAccount, removeAccount, fetchAccount, fetchFailed } = slice.actions;

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

export function* fetchAccountWorker({
  payload: wallet
}: PayloadAction<SerializedWallet & { persistent: boolean }>) {
  try {
    const address: TAddress = yield call(ipcBridgeRenderer.crypto.invoke, {
      type: CryptoRequestType.GET_ADDRESS,
      wallet
    });

    const uuid = generateDeterministicAddressUUID(address);

    if (wallet.persistent) {
      yield call(ipcBridgeRenderer.db.invoke, {
        type: DBRequestType.SAVE_ACCOUNT_SECRETS,
        wallet
      });
    }

    yield put(
      addAccount({
        type: wallet.walletType,
        address,
        uuid,
        dPath: (wallet as SerializedMnemonicPhrase).path,
        persistent: wallet.persistent
      })
    );
    yield put(replace(ROUTE_PATHS.HOME));
  } catch (err) {
    yield put(fetchFailed(err.message));
  }
}

export function* removeAccountWorker({ payload: account }: PayloadAction<IAccount>) {
  if (account.persistent) {
    yield call(ipcBridgeRenderer.db.invoke, {
      type: DBRequestType.DELETE_ACCOUNT_SECRETS,
      uuid: account.uuid
    });
  }
}

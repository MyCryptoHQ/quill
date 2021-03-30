import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { replace } from 'connected-react-router';
import { persistReducer } from 'redux-persist';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import { ROUTE_PATHS } from '@app/routing';
import { ipcBridgeRenderer } from '@bridge';
import { DEFAULT_DERIVATION_PATH } from '@config/derivation';
import {
  CryptoRequestType,
  DBRequestType,
  IAccount,
  SerializedMnemonicPhrase,
  SerializedWallet,
  TAddress,
  WalletType
} from '@types';
import { generateDeterministicAddressUUID } from '@utils';

import { ApplicationState } from './store';
import { storage } from './utils';

export interface AccountsState {
  accounts: IAccount[];
  isFetching: boolean;
  fetchError?: string;
  generatedAccount?: {
    mnemonicPhrase: string;
    address: TAddress;
  };
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
    fetchAccounts(state, _: PayloadAction<(SerializedWallet & { persistent: boolean })[]>) {
      state.isFetching = true;
      state.fetchError = undefined;
    },
    fetchFailed(state, action: PayloadAction<string>) {
      state.isFetching = false;
      state.fetchError = action.payload;
    },
    fetchReset(state) {
      state.isFetching = false;
      state.fetchError = undefined;
    },
    setGeneratedAccount(
      state,
      action: PayloadAction<{ mnemonicPhrase: string; address: TAddress } | undefined>
    ) {
      state.generatedAccount = action.payload;
    }
  }
});

export const {
  addAccount,
  removeAccount,
  fetchAccounts,
  fetchFailed,
  fetchReset,
  setGeneratedAccount
} = slice.actions;

export const generateAccount = createAction(`${sliceName}/generateAccount`);

export default slice;

const persistConfig = {
  key: sliceName,
  keyPrefix: '',
  storage,
  serialize: false,
  deserialize: false,
  whitelist: ['accounts']
};

export const reducer = persistReducer(persistConfig, slice.reducer);

export const getAccounts = createSelector(
  (state: ApplicationState) => state.accounts,
  (accounts) => accounts.accounts
);

export const getAccountError = createSelector(
  (state: ApplicationState) => state.accounts,
  (accounts) => accounts.fetchError
);

export const getAccountsLength = createSelector(getAccounts, (accounts) => accounts.length);

export const getGeneratedAccount = createSelector(
  (state: ApplicationState) => state.accounts,
  (accounts) => accounts.generatedAccount
);

export const getGeneratedMnemonicWords = createSelector(getGeneratedAccount, (account) =>
  account?.mnemonicPhrase.split(' ')
);

/**
 * Sagas
 */
export function* accountsSaga() {
  yield all([
    takeLatest(fetchAccounts.type, fetchAccountsWorker),
    takeLatest(removeAccount.type, removeAccountWorker),
    takeLatest(generateAccount.type, generateAccountWorker)
  ]);
}

export function* fetchAccountsWorker({
  payload: wallets
}: PayloadAction<(SerializedWallet & { persistent: boolean })[]>) {
  const accounts: IAccount[] = yield select(getAccounts);

  try {
    for (const wallet of wallets) {
      const address: TAddress = yield call(ipcBridgeRenderer.crypto.invoke, {
        type: CryptoRequestType.GET_ADDRESS,
        wallet
      });

      const uuid = generateDeterministicAddressUUID(address);

      const existingAccount = accounts.find((a) => a.uuid === uuid);

      if (existingAccount) {
        yield put(removeAccount(existingAccount));
      }

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
    }
    yield put(replace(ROUTE_PATHS.ADD_ACCOUNT_END));
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

export function* generateAccountWorker() {
  const mnemonicPhrase: string = yield call(ipcBridgeRenderer.crypto.invoke, {
    type: CryptoRequestType.CREATE_WALLET,
    wallet: WalletType.MNEMONIC
  });

  const address: TAddress = yield call(ipcBridgeRenderer.crypto.invoke, {
    type: CryptoRequestType.GET_ADDRESS,
    wallet: {
      walletType: WalletType.MNEMONIC,
      path: DEFAULT_DERIVATION_PATH,
      mnemonicPhrase
    }
  });

  yield put(setGeneratedAccount({ mnemonicPhrase, address }));
}

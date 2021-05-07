import { DEFAULT_ETH } from '@mycrypto/wallets';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createAction, createSelector, createSlice } from '@reduxjs/toolkit';
import type { SagaIterator } from 'redux-saga';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import {
  fetchAccounts,
  fetchAddresses,
  fetchFailed,
  generateAccount,
  nextFlow,
  setAddresses,
  setGeneratedAccount
} from '@common/store';
import accountsSlice, { addAccount, removeAccount } from '@common/store/accounts.slice';
import { DEFAULT_MNEMONIC_INDEX } from '@config';
import type {
  GetAddressesResult,
  IAccount,
  SerializedMnemonicPhrase,
  SerializedWallet,
  SerializedWalletWithAddress,
  TAddress
} from '@types';
import { WalletType } from '@types';
import { generateDeterministicAddressUUID } from '@utils';

import { createWallet, getAddress, getAddresses } from './crypto';
import { deleteAccountSecrets, saveAccountSecrets } from './secrets';

export interface AccountsState {
  accountsToAdd: SerializedWalletWithAddress[];
}

export const initialState: AccountsState = {
  accountsToAdd: []
};

const sliceName = accountsSlice.name;

// Minimal slice based on the accounts slice in `common`. The slice name should be the same as the
// common account slice, for synchronisation to work.
const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    setAccountsToAdd(state, action: PayloadAction<SerializedWalletWithAddress[]>) {
      state.accountsToAdd = action.payload;
    }
  }
});

export const { setAccountsToAdd } = slice.actions;

export const addSavedAccounts = createAction<boolean>(`${sliceName}/addSavedAccounts`);

export default slice;

export const getAccountsToAdd = createSelector(
  (state: { accounts: AccountsState }) => state.accounts,
  (accounts) => accounts.accountsToAdd
);

export function* accountsSaga() {
  yield all([
    takeLatest(fetchAccounts.type, fetchAccountsWorker),
    takeLatest(removeAccount.type, removeAccountWorker),
    takeLatest(generateAccount.type, generateAccountWorker),
    takeLatest(fetchAddresses.type, fetchAddressesWorker),
    takeLatest(addSavedAccounts.type, addSavedAccountsWorker)
  ]);
}

export function* fetchAccount(wallet: SerializedWallet): SagaIterator<SerializedWalletWithAddress> {
  const address: TAddress = yield call(getAddress, wallet);
  return {
    ...wallet,
    address
  };
}

export function* fetchAccountsWorker({ payload }: PayloadAction<SerializedWallet[]>) {
  try {
    const wallets: SerializedWalletWithAddress[] = yield all(
      payload.map((wallet) => call(fetchAccount, wallet))
    );

    yield put(setAccountsToAdd(wallets));
    yield put(nextFlow());
  } catch (err) {
    yield put(fetchFailed(err.message));
  }
}

export function* removeAccountWorker({ payload: account }: PayloadAction<IAccount>) {
  if (account.persistent) {
    yield call(deleteAccountSecrets, account.uuid);
  }
}

export function* generateAccountWorker() {
  const mnemonicPhrase: string = yield call(createWallet, WalletType.MNEMONIC);

  const address: TAddress = yield call(getAddress, {
    walletType: WalletType.MNEMONIC,
    path: DEFAULT_ETH,
    index: DEFAULT_MNEMONIC_INDEX,
    mnemonicPhrase
  });

  yield put(setGeneratedAccount({ mnemonicPhrase, address }));
}

export function* fetchAddressesWorker({ payload }: ReturnType<typeof fetchAddresses>) {
  const { wallet, path, limit, offset } = payload;

  try {
    const addresses: GetAddressesResult[] = yield call(getAddresses, wallet, path, limit, offset);
    yield put(setAddresses(addresses));
  } catch (error) {
    yield put(fetchFailed(error.message));
  }
}

export function* addSavedAccountsWorker({ payload: persistent }: PayloadAction<boolean>) {
  const accounts: SerializedWalletWithAddress[] = yield select(getAccountsToAdd);

  for (const wallet of accounts) {
    const uuid = generateDeterministicAddressUUID(wallet.address);

    const account = {
      type: wallet.walletType,
      address: wallet.address,
      uuid,
      dPath: (wallet as SerializedMnemonicPhrase).path,
      index: (wallet as SerializedMnemonicPhrase).index,
      persistent
    };

    // Remove existing account if present, set persistent to true to wipe saved secret if present too
    yield put(removeAccount({ ...account, persistent: true }));
    yield put(addAccount(account));

    if (persistent) {
      yield call(saveAccountSecrets, wallet);
    }
  }

  yield put(nextFlow());
}

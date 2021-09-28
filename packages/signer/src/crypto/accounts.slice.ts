import { DEFAULT_ETH } from '@mycrypto/wallets';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSelector, createSlice } from '@reduxjs/toolkit';
import {
  accountsSlice,
  addAccount,
  addGeneratedAccount,
  addSavedAccounts,
  fetchAccounts,
  fetchAddresses,
  fetchFailed,
  generateAccount,
  generateDeterministicAddressUUID,
  getGeneratedAccount,
  nextFlow,
  removeAccount,
  setAddresses,
  setExtendedKey,
  setGeneratedAccount,
  WalletType
} from '@signer/common';
import type {
  AccountsState,
  GetAddressesResult,
  IAccount,
  SerializedWallet,
  SerializedWalletWithAddress,
  TAddress
} from '@signer/common';
import type { SagaIterator } from 'redux-saga';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import { DEFAULT_MNEMONIC_INDEX } from '@config';

import { createWallet, derivePrivateKey, getAddress, getAddresses, getExtendedKey } from './crypto';
import { deleteAccountSecrets, saveAccountSecrets } from './secrets';

export type CryptoAccountsState = Pick<AccountsState, 'add' | 'generatedAccount'>;

export const initialState: CryptoAccountsState = {};

const sliceName = accountsSlice.name;

// Minimal slice based on the accounts slice in `common`. The slice name should be the same as the
// common account slice, for synchronisation to work.
const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    setAddAccounts(
      state,
      action: PayloadAction<{
        accounts: SerializedWalletWithAddress[];
        secret: string;
      }>
    ) {
      state.add = action.payload;
    },
    clearAddAccounts(state) {
      state.add = undefined;
    },
    setGeneratedAccount(
      state,
      action: PayloadAction<{ mnemonicPhrase: string; address: TAddress } | undefined>
    ) {
      state.generatedAccount = action.payload;
    }
  }
});

const { setAddAccounts } = slice.actions;

export default slice;

export const getAccountsToAdd = createSelector(
  (state: { accounts: CryptoAccountsState }) => state.accounts,
  (accounts) => accounts.add?.accounts
);

export function* accountsSaga() {
  yield all([
    takeLatest(fetchAccounts.type, fetchAccountsWorker),
    takeLatest(removeAccount.type, removeAccountWorker),
    takeLatest(generateAccount.type, generateAccountWorker),
    takeLatest(fetchAddresses.type, fetchAddressesWorker),
    takeLatest(addSavedAccounts.type, addSavedAccountsWorker),
    takeLatest(addGeneratedAccount.type, addGeneratedAccountWorker)
  ]);
}

export function* getSecret(wallet: SerializedWallet): SagaIterator<string> {
  if (wallet.walletType === WalletType.KEYSTORE) {
    return yield call(derivePrivateKey, wallet);
  }

  if (wallet.walletType === WalletType.PRIVATE_KEY) {
    return wallet.privateKey;
  }

  return wallet.mnemonicPhrase;
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
    const secret: string = yield call(getSecret, payload[0]);
    const accounts: SerializedWalletWithAddress[] = yield all(
      payload.map((wallet) => call(fetchAccount, wallet))
    );

    yield put(
      setAddAccounts({
        accounts,
        secret
      })
    );
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
    const extendedKey: string = yield call(getExtendedKey, wallet, path);

    yield put(setExtendedKey(extendedKey));
    yield put(setAddresses(addresses));
  } catch (error) {
    yield put(fetchFailed(error.message));
  }
}

const getAccountFromSerializedWallet = (
  wallet: SerializedWalletWithAddress,
  persistent: boolean
): IAccount => {
  const uuid = generateDeterministicAddressUUID(wallet.address);

  if (wallet.walletType === WalletType.MNEMONIC) {
    return {
      type: wallet.walletType,
      address: wallet.address,
      uuid,
      persistent,
      path: wallet.path,
      index: wallet.index
    };
  }

  return {
    type: wallet.walletType,
    address: wallet.address,
    uuid,
    persistent
  };
};

export function* addSavedAccountsWorker({ payload: persistent }: PayloadAction<boolean>) {
  const accounts: SerializedWalletWithAddress[] = yield select(getAccountsToAdd);

  for (const wallet of accounts) {
    const account = getAccountFromSerializedWallet(wallet, persistent);

    // Remove existing account if present, set persistent to true to wipe saved secret if present too
    yield put(removeAccount({ ...account, persistent: true }));
    yield put(addAccount(account));

    if (persistent) {
      yield call(saveAccountSecrets, wallet);
    }
  }

  yield put(nextFlow());
}

export function* addGeneratedAccountWorker({ payload: persistent }: PayloadAction<boolean>) {
  const { address, mnemonicPhrase }: { mnemonicPhrase: string; address: TAddress } = yield select(
    getGeneratedAccount
  );

  const wallet: SerializedWalletWithAddress = {
    walletType: WalletType.MNEMONIC,
    path: DEFAULT_ETH,
    index: DEFAULT_MNEMONIC_INDEX,
    mnemonicPhrase,
    address
  };

  const account = getAccountFromSerializedWallet(wallet, persistent);

  // Remove existing account if present, set persistent to true to wipe saved secret if present too
  yield put(removeAccount({ ...account, persistent: true }));
  yield put(addAccount(account));

  if (persistent) {
    yield call(saveAccountSecrets, wallet);
  }

  yield put(nextFlow());
}

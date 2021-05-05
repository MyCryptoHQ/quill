import { DEFAULT_ETH } from '@mycrypto/wallets';
import type { PayloadAction } from '@reduxjs/toolkit';
import { push } from 'connected-react-router';
import type { SagaIterator } from 'redux-saga';
import { all, call, put, takeEvery, takeLatest } from 'redux-saga/effects';

import { ROUTE_PATHS } from '@app/routing';
import {
  fetchAccounts,
  fetchAddresses,
  fetchFailed,
  generateAccount,
  persistAccount,
  removeAccount,
  setAddresses,
  setGeneratedAccount
} from '@common/store';
import { setAccountsToAdd } from '@common/store/accounts.slice';
import { DEFAULT_MNEMONIC_INDEX } from '@config/derivation';
import type {
  GetAddressesResult,
  IAccount,
  SerializedWallet,
  SerializedWalletWithAddress,
  TAddress
} from '@types';
import { WalletType } from '@types';

import { createWallet, getAddress, getAddresses } from './crypto';
import { deleteAccountSecrets, saveAccountSecrets } from './secrets';

export function* accountsSaga() {
  yield all([
    takeLatest(fetchAccounts.type, fetchAccountsWorker),
    takeLatest(removeAccount.type, removeAccountWorker),
    takeLatest(generateAccount.type, generateAccountWorker),
    takeLatest(fetchAddresses.type, fetchAddressesWorker),
    takeEvery(persistAccount.type, persistAccountWorker)
  ]);
}

export function* fetchAccountWorker(
  wallet: SerializedWallet
): SagaIterator<SerializedWalletWithAddress> {
  const address: TAddress = yield call(getAddress, wallet);
  return {
    ...wallet,
    address
  };
}

export function* fetchAccountsWorker({ payload }: PayloadAction<SerializedWallet[]>) {
  try {
    const wallets: SerializedWalletWithAddress[] = yield all(
      payload.map((wallet) => call(fetchAccountWorker, wallet))
    );

    yield put(setAccountsToAdd(wallets));
    yield put(push(ROUTE_PATHS.ADD_ACCOUNT_SECURITY));
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

export function* persistAccountWorker({ payload }: ReturnType<typeof persistAccount>) {
  yield call(saveAccountSecrets, payload);
}

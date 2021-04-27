import { DEFAULT_ETH } from '@mycrypto/wallets';
import type { PayloadAction } from '@reduxjs/toolkit';
import { replace } from 'connected-react-router';
import { all, call, put, takeLatest } from 'redux-saga/effects';

import { ROUTE_PATHS } from '@app/routing';
import {
  addAccount,
  fetchAccounts,
  fetchAddresses,
  fetchFailed,
  generateAccount,
  removeAccount,
  setAddresses,
  setGeneratedAccount
} from '@common/store';
import { DEFAULT_MNEMONIC_INDEX } from '@config/derivation';
import type {
  GetAddressesResult,
  IAccount,
  SerializedMnemonicPhrase,
  SerializedWallet,
  TAddress
} from '@types';
import { WalletType } from '@types';
import { generateDeterministicAddressUUID } from '@utils';

import { createWallet, getAddress, getAddresses } from './crypto';
import { deleteAccountSecrets, saveAccountSecrets } from './secrets';

export function* accountsSaga() {
  yield all([
    takeLatest(fetchAccounts.type, fetchAccountsWorker),
    takeLatest(removeAccount.type, removeAccountWorker),
    takeLatest(generateAccount.type, generateAccountWorker),
    takeLatest(fetchAddresses.type, fetchAddressesWorker)
  ]);
}

export function* fetchAccountsWorker({
  payload: wallets
}: PayloadAction<(SerializedWallet & { persistent: boolean })[]>) {
  try {
    for (const wallet of wallets) {
      const address: TAddress = yield call(getAddress, wallet);

      const uuid = generateDeterministicAddressUUID(address);

      const account = {
        type: wallet.walletType,
        address,
        uuid,
        dPath: (wallet as SerializedMnemonicPhrase).path,
        index: (wallet as SerializedMnemonicPhrase).index,
        persistent: wallet.persistent
      };

      // Remove existing account if present, set persistent to true to wipe saved secret if present too
      yield put(removeAccount({ ...account, persistent: true }));

      if (wallet.persistent) {
        yield call(saveAccountSecrets, wallet);
      }

      yield put(addAccount(account));
    }
    yield put(replace(ROUTE_PATHS.ADD_ACCOUNT_END));
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

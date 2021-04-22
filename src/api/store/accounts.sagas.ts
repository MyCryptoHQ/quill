import { DEFAULT_ETH } from '@mycrypto/wallets';
import type { PayloadAction } from '@reduxjs/toolkit';
import { replace } from 'connected-react-router';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import { createWallet, getAddress, getAddresses } from '@api/crypto';
import { deleteAccountSecrets, saveAccountSecrets } from '@api/db';
import { ROUTE_PATHS } from '@app/routing';
import {
  addAccount,
  fetchAccounts,
  fetchAddresses,
  fetchFailed,
  generateAccount,
  getAccounts,
  removeAccount,
  setAddresses,
  setGeneratedAccount
} from '@common/store';
import { DEFAULT_MNEMONIC_INDEX } from '@config';
import type {
  GetAddressesResult,
  IAccount,
  SerializedMnemonicPhrase,
  SerializedWallet,
  TAddress,
  UserRequest
} from '@types';
import { WalletType } from '@types';
import { generateDeterministicAddressUUID } from '@utils';

import { reply, requestAccounts } from './ws.slice';

export function* accountsSaga() {
  yield all([
    takeLatest(requestAccounts.type, getAccountsWorker),
    takeLatest(fetchAccounts.type, fetchAccountsWorker),
    takeLatest(fetchAddresses.type, fetchAddressesWorker),
    takeLatest(removeAccount.type, removeAccountWorker),
    takeLatest(generateAccount.type, generateAccountWorker)
  ]);
}

export function* getAccountsWorker({ payload }: PayloadAction<UserRequest>) {
  const accounts: IAccount[] = yield select(getAccounts);

  yield put(
    reply({
      id: payload.request.id,
      result: accounts.map((account) => account.address)
    })
  );
}

export function* fetchAccountsWorker({
  payload: wallets
}: PayloadAction<(SerializedWallet & { persistent: boolean })[]>) {
  const accounts: IAccount[] = yield select(getAccounts);

  try {
    for (const wallet of wallets) {
      const address: TAddress = yield call(getAddress, wallet);

      const uuid = generateDeterministicAddressUUID(address);

      const existingAccount = accounts.find((a) => a.uuid === uuid);

      if (existingAccount) {
        yield put(removeAccount(existingAccount));
      }

      if (wallet.persistent) {
        yield call(saveAccountSecrets, wallet);
      }

      yield put(
        addAccount({
          type: wallet.walletType,
          address,
          uuid,
          dPath: (wallet as SerializedMnemonicPhrase).path,
          index: (wallet as SerializedMnemonicPhrase).index,
          persistent: wallet.persistent
        })
      );
    }
    yield put(replace(ROUTE_PATHS.ADD_ACCOUNT_END));
  } catch (err) {
    yield put(fetchFailed(err.message));
  }
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

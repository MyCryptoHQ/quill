import type { PayloadAction } from '@reduxjs/toolkit';
import { push } from 'connected-react-router';
import { all, put, select, takeLatest } from 'redux-saga/effects';

import {
  addAccount,
  addSavedAccounts,
  getAccounts,
  getAccountsToAdd,
  persistAccount,
  removeAccount
} from '@common/store';
import { ROUTE_PATHS } from '@routing';
import type {
  IAccount,
  SerializedMnemonicPhrase,
  SerializedWalletWithAddress,
  UserRequest
} from '@types';
import { generateDeterministicAddressUUID } from '@utils';

import { reply, requestAccounts } from './ws.slice';

export function* accountsSaga() {
  yield all([
    takeLatest(requestAccounts.type, getAccountsWorker),
    takeLatest(addSavedAccounts.type, addSavedAccountsWorker)
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
      yield put(persistAccount(wallet));
    }
  }

  yield put(push(ROUTE_PATHS.ADD_ACCOUNT_END));
}

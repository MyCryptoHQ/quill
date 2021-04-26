// @fixme DONT DO THIS
import { getAddress } from '@crypto/crypto';
import type { PayloadAction } from '@reduxjs/toolkit';
import { replace } from 'connected-react-router';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import { ROUTE_PATHS } from '@app/routing';
import {
  addAccount,
  fetchAccounts,
  fetchFailed,
  getAccounts,
  removeAccount,
  saveAccountSecrets
} from '@common/store';
import type {
  IAccount,
  SerializedMnemonicPhrase,
  SerializedWallet,
  TAddress,
  UserRequest
} from '@types';
import { generateDeterministicAddressUUID } from '@utils';

import { reply, requestAccounts } from './ws.slice';

export function* accountsSaga() {
  yield all([
    takeLatest(requestAccounts.type, getAccountsWorker),
    takeLatest(fetchAccounts.type, fetchAccountsWorker)
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
        yield put(saveAccountSecrets(wallet));
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

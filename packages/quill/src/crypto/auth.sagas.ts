import type { TUuid } from '@quill/common';
import {
  changePassword,
  changePasswordFailed,
  changePasswordSuccess,
  checkNewUser,
  createPassword,
  createPasswordSuccess,
  login,
  loginFailed,
  loginSuccess,
  logout,
  rehydrateAllState,
  reset,
  resetSettings,
  setNewUser,
  translateRaw
} from '@quill/common';
import type { PayloadAction } from '@reduxjs/toolkit';
import { push } from 'connected-react-router';
import keytar from 'keytar';
import { all, call, put, takeLatest } from 'redux-saga/effects';

import { KEYTAR_SALT_NAME, KEYTAR_SERVICE } from '@config';

import { ROUTE_PATHS } from '../app/routing';
import {
  checkSettingsKey,
  clearEncryptionKey,
  comparePassword,
  deleteSalt,
  getSettingsKey,
  hasSettingsKey,
  init,
  safeGetPrivateKey,
  savePrivateKey
} from './secrets';

export function* authSaga() {
  yield all([
    takeLatest(checkNewUser.type, checkNewUserWorker),
    takeLatest(login.type, loginWorker),
    takeLatest(createPassword.type, createPasswordWorker),
    takeLatest(changePassword.type, changePasswordWorker),
    takeLatest(logout.type, logoutWorker),
    takeLatest(reset.type, resetWorker)
  ]);
}

export function* checkNewUserWorker() {
  const existingUser: boolean = yield call(hasSettingsKey);
  yield put(setNewUser(!existingUser));
}

export function* loginWorker({ payload }: PayloadAction<string>) {
  yield call(init, payload);

  const result = yield call(checkSettingsKey);
  if (result) {
    yield put(loginSuccess());
    yield put(rehydrateAllState());
    return;
  }

  yield put(loginFailed(translateRaw('LOGIN_ERROR')));
}

export function* createPasswordWorker({ payload }: PayloadAction<string>) {
  yield call(resetWorker);
  yield call(init, payload);

  // Generates a new settings key
  yield call(getSettingsKey);
  yield put(createPasswordSuccess());
  yield put(rehydrateAllState());
  yield put(push(ROUTE_PATHS.SETUP_ACCOUNT));
}

export function* getAccountPrivateKey(account: TUuid) {
  const privateKey: string | null = yield call(safeGetPrivateKey, account);
  if (privateKey) {
    return [account, privateKey];
  }

  return null;
}

export function* changePasswordWorker({ payload }: ReturnType<typeof changePassword>) {
  try {
    const isEqual: boolean = yield call(comparePassword, payload.currentPassword);
    if (!isEqual) {
      yield put(changePasswordFailed(translateRaw('CURRENT_PASSWORD_NOT_EQUAL')));
      return;
    }

    const credentials: { account: TUuid }[] = yield call(keytar.findCredentials, KEYTAR_SERVICE);

    const privateKeys: ([account: TUuid, privateKey: string] | null)[] = yield all(
      credentials
        .filter(({ account }) => account !== KEYTAR_SALT_NAME)
        .map(({ account }) => call(getAccountPrivateKey, account))
    );

    // Delete the salt from the keychain so it will generate a new one, and re-initialise the
    // encryption key.
    yield call(deleteSalt);
    yield call(init, payload.password);

    yield all(
      privateKeys
        .filter(Boolean)
        .map(([account, privateKey]) => call(savePrivateKey, account, privateKey))
    );

    yield put(changePasswordSuccess());
    yield put(logout());
  } catch (error) {
    yield put(changePasswordFailed(error.toString()));
  }
}

export function* logoutWorker() {
  yield call(clearEncryptionKey);
}

export function* resetWorker() {
  yield put(resetSettings());

  // Clears all private keys from the keychain (including the settings key)
  const credentials = yield call(keytar.findCredentials, KEYTAR_SERVICE);
  for (const { account } of credentials) {
    yield call(keytar.deletePassword, KEYTAR_SERVICE, account);
  }
}

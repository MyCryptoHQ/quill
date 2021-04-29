import type { PayloadAction } from '@reduxjs/toolkit';
import { push } from 'connected-react-router';
import keytar from 'keytar';
import { all, call, put, takeLatest } from 'redux-saga/effects';

import {
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
  setNewUser
} from '@common/store';
import { translateRaw } from '@common/translate';
import { KEYTAR_SERVICE } from '@config';

import { ROUTE_PATHS } from '../app/routing';
import {
  checkSettingsKey,
  clearEncryptionKey,
  getSettingsKey,
  hasSettingsKey,
  init
} from './secrets';

export function* authSaga() {
  yield all([
    takeLatest(checkNewUser.type, checkNewUserWorker),
    takeLatest(login.type, loginWorker),
    takeLatest(createPassword.type, createPasswordWorker),
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
  yield call(getSettingsKey);
  yield put(createPasswordSuccess());
  yield put(push(ROUTE_PATHS.SETUP_ACCOUNT));
}

export function* logoutWorker() {
  yield call(clearEncryptionKey);
}

export function* resetWorker() {
  yield put(resetSettings());

  const credentials = yield call(keytar.findCredentials, KEYTAR_SERVICE);
  for (const { account } of credentials) {
    yield call(keytar.deletePassword, KEYTAR_SERVICE, account);
  }
}

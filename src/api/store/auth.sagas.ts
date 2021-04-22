import type { PayloadAction } from '@reduxjs/toolkit';
import { push } from 'connected-react-router';
import { all, call, put, takeLatest } from 'redux-saga/effects';

import {
  init as initFn,
  login as loginFn,
  logout as logoutFn,
  reset as resetFn,
  storeExists
} from '@api/db';
import {
  checkNewUser,
  createPassword,
  createPasswordFailed,
  createPasswordSuccess,
  init,
  login,
  loginFailed,
  loginSuccess,
  logout,
  reset,
  setNewUser
} from '@common/store';
import { translateRaw } from '@common/translate';
import { ROUTE_PATHS } from '@routing';

export function* authSaga() {
  yield all([
    takeLatest(checkNewUser.type, checkNewUserWorker),
    takeLatest(createPassword.type, createPasswordWorker),
    takeLatest(login.type, loginWorker),
    takeLatest(logout.type, logoutWorker),
    takeLatest(reset.type, resetWorker)
  ]);
}

export function* checkNewUserWorker() {
  const existingUser: boolean = yield call(storeExists);
  yield put(setNewUser(!existingUser));
}

export function* createPasswordWorker({ payload }: PayloadAction<string>) {
  const result = yield call(initFn, payload);

  if (result) {
    yield put(createPasswordSuccess());
    yield put(push(ROUTE_PATHS.SETUP_ACCOUNT));
    return;
  }

  yield put(createPasswordFailed(translateRaw('CREATE_PASSWORD_ERROR')));
}

export function* loginWorker({ payload }: PayloadAction<string>) {
  const result = yield call(loginFn, payload);

  if (result) {
    yield put(loginSuccess());
    yield put(init(payload));
    return;
  }

  yield put(loginFailed(translateRaw('LOGIN_ERROR')));
}

export function* logoutWorker() {
  yield call(logoutFn);
}

export function* resetWorker() {
  yield call(resetFn);
}

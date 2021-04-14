import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { push } from 'connected-react-router';
import { all, call, put, takeLatest } from 'redux-saga/effects';

import { ipcBridgeRenderer } from '@bridge';
import { translateRaw } from '@common/translate';
import { ROUTE_PATHS } from '@routing';
import { DBRequestType } from '@types';

interface AuthState {
  newUser: boolean;
  loggedIn: boolean;
  error?: string;
}

export const initialState: AuthState = { newUser: true, loggedIn: false };

const sliceName = 'auth';

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    setNewUser(state, action: PayloadAction<boolean>) {
      state.newUser = action.payload;
    },
    setLoggedIn(state, action: PayloadAction<boolean>) {
      state.loggedIn = action.payload;
    },
    loginSuccess(state) {
      state.loggedIn = true;
      state.error = undefined;
    },
    loginFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    logout(state) {
      // Required since we clear the entire state when logout is dispatched
      state.newUser = false;
      state.loggedIn = false;
    },
    createPasswordSuccess(state) {
      state.newUser = false;
      state.loggedIn = true;
      state.error = undefined;
    },
    createPasswordFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
    }
  }
});

export const createPassword = createAction<string>(`${sliceName}/createPassword`);
export const login = createAction<string>(`${sliceName}/login`);

export const {
  setNewUser,
  setLoggedIn,
  loginSuccess,
  loginFailed,
  logout,
  createPasswordSuccess,
  createPasswordFailed
} = slice.actions;

export default slice;

/**
 * Sagas
 */
export function* authSaga() {
  yield all([
    takeLatest(createPassword.type, createPasswordWorker),
    takeLatest(login.type, loginWorker),
    takeLatest(logout.type, logoutWorker)
  ]);
}

export function* createPasswordWorker({ payload }: PayloadAction<string>) {
  const result = yield call(ipcBridgeRenderer.db.invoke, {
    type: DBRequestType.INIT,
    password: payload
  });

  if (result) {
    yield put(createPasswordSuccess());
    yield put(push(ROUTE_PATHS.SETUP_ACCOUNT));
    return;
  }

  yield put(createPasswordFailed(translateRaw('CREATE_PASSWORD_ERROR')));
}

export function* loginWorker({ payload }: PayloadAction<string>) {
  const result = yield call(ipcBridgeRenderer.db.invoke, {
    type: DBRequestType.LOGIN,
    password: payload
  });

  if (result) {
    yield put(loginSuccess());
    return;
  }

  yield put(loginFailed(translateRaw('LOGIN_ERROR')));
}

export function* logoutWorker() {
  yield call(ipcBridgeRenderer.db.invoke, { type: DBRequestType.LOGOUT });
}

import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { all, call, put, takeLatest } from 'redux-saga/effects';

import { ipcBridgeRenderer } from '@bridge';
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
    },
    loginFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    logout(state) {
      // Required since we clear the entire state when logout is dispatched
      state.newUser = false;
      state.loggedIn = false;
    }
  }
});

export const login = createAction<string>(`${sliceName}/login`);

export const { setNewUser, setLoggedIn, loginSuccess, loginFailed, logout } = slice.actions;

export default slice;

/**
 * Sagas
 */
export function* authSaga() {
  yield all([takeLatest(login.type, loginWorker), takeLatest(logout.type, logoutWorker)]);
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

  yield put(loginFailed('An error occurred'));
}

export function* logoutWorker() {
  yield call(ipcBridgeRenderer.db.invoke, { type: DBRequestType.LOGOUT });
}

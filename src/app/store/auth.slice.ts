import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { call, takeLatest } from 'redux-saga/effects';

import { ipcBridgeRenderer } from '@bridge';
import { DBRequestType } from '@types';

export const initialState = { newUser: true, loggedIn: false };

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
    logout(state) {
      state.loggedIn = false;
    }
  }
});

export const { setNewUser, setLoggedIn, logout } = slice.actions;

export default slice;

/**
 * Sagas
 */
export function* authSaga() {
  yield takeLatest(logout.type, logoutWorker);
}

export function* logoutWorker() {
  yield call(ipcBridgeRenderer.db.invoke, { type: DBRequestType.LOGOUT });
}

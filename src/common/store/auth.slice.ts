import type { PayloadAction } from '@reduxjs/toolkit';
import { createAction, createSelector, createSlice } from '@reduxjs/toolkit';

interface AuthState {
  newUser: boolean;
  loggingIn: boolean;
  loggedIn: boolean;
  error?: string;
}

export const initialState: AuthState = { newUser: true, loggedIn: false, loggingIn: false };

const sliceName = 'auth';

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    setNewUser(state, action: PayloadAction<boolean>) {
      state.newUser = action.payload;
    },
    login(state, _action: PayloadAction<string>) {
      state.loggingIn = true;
    },
    loginSuccess(state) {
      state.loggedIn = true;
      state.loggingIn = false;
      state.error = undefined;
    },
    loginFailed(state, action: PayloadAction<string>) {
      state.loggingIn = false;
      state.error = action.payload;
    },
    logout(state) {
      // Required since we clear the entire state when logout is dispatched
      state.newUser = false;
      state.loggedIn = false;
    },
    createPassword(state, _action: PayloadAction<string>) {
      state.loggingIn = true;
    },
    createPasswordSuccess(state) {
      state.newUser = false;
      state.loggedIn = true;
      state.loggingIn = false;
      state.error = undefined;
    },
    createPasswordFailed(state, action: PayloadAction<string>) {
      state.loggingIn = false;
      state.error = action.payload;
    },
    reset() {
      return initialState;
    }
  }
});

export const checkNewUser = createAction(`${sliceName}/checkNewUser`);

export const {
  setNewUser,
  login,
  loginSuccess,
  loginFailed,
  logout,
  createPassword,
  createPasswordSuccess,
  createPasswordFailed,
  reset
} = slice.actions;

export default slice;

export const getLoggingIn = createSelector(
  (state: { auth: AuthState }) => state.auth,
  (auth) => auth.loggingIn
);

export const getLoggedIn = createSelector(
  (state: { auth: AuthState }) => state.auth,
  (auth) => auth.loggedIn
);

export const getNewUser = createSelector(
  (state: { auth: AuthState }) => state.auth,
  (auth) => auth.newUser
);

import type { PayloadAction } from '@reduxjs/toolkit';
import { createAction, createSlice } from '@reduxjs/toolkit';

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
    },
    reset(state) {
      state.newUser = true;
    }
  }
});

export const checkNewUser = createAction(`${sliceName}/checkNewUser`);
export const createPassword = createAction<string>(`${sliceName}/createPassword`);
export const login = createAction<string>(`${sliceName}/login`);

export const {
  setNewUser,
  setLoggedIn,
  loginSuccess,
  loginFailed,
  logout,
  createPasswordSuccess,
  createPasswordFailed,
  reset
} = slice.actions;

export default slice;

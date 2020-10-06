import { createAction } from '@reduxjs/toolkit';

import { LoginState } from '@types';

export interface AuthState {
  state: LoginState;
}

export const INITIAL_STATE: AuthState = { state: LoginState.LOGGED_OUT };

export const setLoginState = createAction<LoginState>('auth/setLoginState');

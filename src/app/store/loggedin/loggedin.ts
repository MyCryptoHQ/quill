import { createAction } from '@reduxjs/toolkit';
import { LoginState } from '@types/db';

export type LoggedInState = LoginState;

export const INITIAL_STATE: LoggedInState = LoginState.LOGGED_OUT;

export const setLoginState = createAction<LoginState>('loggedin/setLoginState');
import { createAction } from '@reduxjs/toolkit';

import { LoginState } from '@types';

export const INITIAL_STATE: LoginState = LoginState.LOGGED_OUT;

export const setLoginState = createAction<LoginState>('login/setLoginState');

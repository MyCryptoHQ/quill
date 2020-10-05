import { createReducer } from '@reduxjs/toolkit';

import { LoginState } from '@types';

import { INITIAL_STATE, setLoginState } from './login';

export const reducer = createReducer<LoginState>(INITIAL_STATE, (builder) =>
  builder.addCase(setLoginState, (_state, action) => {
    return action.payload;
  })
);

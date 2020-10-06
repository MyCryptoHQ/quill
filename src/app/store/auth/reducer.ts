import { createReducer } from '@reduxjs/toolkit';

import { AuthState, INITIAL_STATE, setLoginState } from './auth';

export const reducer = createReducer<AuthState>(INITIAL_STATE, (builder) =>
  builder.addCase(setLoginState, (state, action) => {
    return { ...state, state: action.payload };
  })
);

import { createReducer } from '@reduxjs/toolkit';

import { INITIAL_STATE, LoggedInState, setLoginState } from './loggedin';

export const reducer = createReducer<LoggedInState>(INITIAL_STATE, (builder) =>
  builder
    .addCase(setLoginState, (_state, action) => {
      return action.payload;
    })
);

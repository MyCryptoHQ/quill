import { createReducer } from '@reduxjs/toolkit';

import { AccountsState, INITIAL_STATE, setAccounts } from './account';

export const reducer = createReducer<AccountsState>(INITIAL_STATE, (builder) =>
  builder.addCase(setAccounts, (_state, action) => {
    return action.payload;
  })
);

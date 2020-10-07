import { createReducer } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';

import { storage } from '../utils';
import { AccountsState, INITIAL_STATE, setAccounts } from './account';

const rawReducer = createReducer<AccountsState>(INITIAL_STATE, (builder) =>
  builder.addCase(setAccounts, (_state, action) => {
    return action.payload;
  })
);

const persistConfig = {
  key: 'accounts',
  keyPrefix: '',
  storage,
  serialize: false,
  deserialize: false
};

export const reducer = persistReducer(persistConfig, rawReducer);

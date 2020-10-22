import { createReducer } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';

import { storage } from '../utils';
import { AccountsState, addAccount, INITIAL_STATE, removeAccount } from './account';

const rawReducer = createReducer<AccountsState>(INITIAL_STATE, (builder) =>
  builder
    .addCase(addAccount, (state, action) => {
      return { ...state, accounts: { [action.payload.uuid]: action.payload, ...state.accounts } };
    })
    .addCase(removeAccount, (state, action) => {
      const {
        accounts: { [action.payload.uuid]: toDelete, ...rest }
      } = state;
      return { ...state, accounts: rest };
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

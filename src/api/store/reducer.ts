import { combineReducers } from '@reduxjs/toolkit';

import accounts from '@common/store/accounts.slice';
import synchronization from '@common/store/synchronization.slice';

import { persistedReducer as accountsReducer } from './account.persist';

export const createRootReducer = () => {
  return combineReducers({
    [synchronization.name]: synchronization.reducer,
    [accounts.name]: accountsReducer
  });
};

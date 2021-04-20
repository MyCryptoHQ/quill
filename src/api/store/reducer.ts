import { combineReducers } from '@reduxjs/toolkit';

import accounts from '@common/store/accounts.slice';
import persistence from '@common/store/persistence.slice';
import synchronization from '@common/store/synchronization.slice';

import { persistedReducer as accountsReducer } from './account.persist';

export const createRootReducer = () => {
  return combineReducers({
    [synchronization.name]: synchronization.reducer,
    [persistence.name]: persistence.reducer,
    [accounts.name]: accountsReducer
  });
};

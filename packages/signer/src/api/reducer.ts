import { combineReducers } from '@reduxjs/toolkit';

import accounts from '@common/store/accounts.slice';
import authentication from '@common/store/auth.slice';
import permissions from '@common/store/permissions.slice';
import persistence from '@common/store/storage/persistence.slice';
import synchronization from '@common/store/synchronization.slice';
import transactions from '@common/store/transactions.slice';
import { wrapRootReducer } from '@common/utils';

import { persistedReducer as accountsReducer } from './account.persist';
import { persistedReducer as permissionsReducer } from './permissions.persist';
import { persistedReducer as transactionsReducer } from './transactions.persist';

export const createRootReducer = () => {
  const reducer = combineReducers({
    [synchronization.name]: synchronization.reducer,
    [persistence.name]: persistence.reducer,
    [authentication.name]: authentication.reducer,
    [accounts.name]: accountsReducer,
    [transactions.name]: transactionsReducer,
    [permissions.name]: permissionsReducer
  });

  return wrapRootReducer(reducer);
};

import { combineReducers } from '@reduxjs/toolkit';

import synchronization from '@common/store/synchronization.slice';
import transactions from '@common/store/transactions.slice';
import { wrapRootReducer } from '@common/utils';

import accounts from './accounts.slice';

export const createRootReducer = () => {
  const reducer = combineReducers({
    [synchronization.name]: synchronization.reducer,
    [transactions.name]: transactions.reducer,
    [accounts.name]: accounts.reducer
  });

  return wrapRootReducer(reducer);
};

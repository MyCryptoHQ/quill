import { combineReducers } from '@reduxjs/toolkit';

import synchronization from '@common/store/synchronization.slice';
import transactions from '@common/store/transactions.slice';

export const createRootReducer = () => {
  return combineReducers({
    [synchronization.name]: synchronization.reducer,
    [transactions.name]: transactions.reducer
  });
};

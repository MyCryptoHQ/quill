import { combineReducers } from '@reduxjs/toolkit';
import { synchronizationSlice, transactionsSlice, wrapRootReducer } from '@signer/common';

import accounts from './accounts.slice';

export const createRootReducer = () => {
  const reducer = combineReducers({
    [synchronizationSlice.name]: synchronizationSlice.reducer,
    [transactionsSlice.name]: transactionsSlice.reducer,
    [accounts.name]: accounts.reducer
  });

  return wrapRootReducer(reducer);
};

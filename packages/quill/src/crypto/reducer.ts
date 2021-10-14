import { synchronizationSlice, transactionsSlice, wrapRootReducer } from '@quill/common';
import { combineReducers } from '@reduxjs/toolkit';

import accounts from './accounts.slice';

export const createRootReducer = () => {
  const reducer = combineReducers({
    [synchronizationSlice.name]: synchronizationSlice.reducer,
    [transactionsSlice.name]: transactionsSlice.reducer,
    [accounts.name]: accounts.reducer
  });

  return wrapRootReducer(reducer);
};

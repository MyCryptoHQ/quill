import { combineReducers } from '@reduxjs/toolkit';
import {
  accountsSlice,
  authSlice,
  permissionsSlice,
  persistenceSlice,
  synchronizationSlice,
  transactionsSlice,
  wrapRootReducer
} from '@signer/common';

import { persistedReducer as accountsReducer } from './account.persist';
import { persistedReducer as permissionsReducer } from './permissions.persist';
import { persistedReducer as transactionsReducer } from './transactions.persist';

export const createRootReducer = () => {
  const reducer = combineReducers({
    [synchronizationSlice.name]: synchronizationSlice.reducer,
    [persistenceSlice.name]: persistenceSlice.reducer,
    [authSlice.name]: authSlice.reducer,
    [accountsSlice.name]: accountsReducer,
    [transactionsSlice.name]: transactionsReducer,
    [permissionsSlice.name]: permissionsReducer
  });

  return wrapRootReducer(reducer);
};

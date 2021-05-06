import { connectRouter } from 'connected-react-router';
import type { History } from 'history';
import { combineReducers } from 'redux';

import { createPersistReducer } from '@common/store';
import accountSlice from '@common/store/accounts.slice';
import authSlice from '@common/store/auth.slice';
import flowSlice from '@common/store/flow.slice';
import permissionsSlice from '@common/store/permissions.slice';
import signingSlice from '@common/store/signing.slice';
import persistenceSlice from '@common/store/storage/persistence.slice';
import synchronizationSlice from '@common/store/synchronization.slice';
import transactionsSlice from '@common/store/transactions.slice';
import { wrapRootReducer } from '@common/utils';

export const createRootReducer = (history: History) => {
  const reducer = combineReducers({
    router: connectRouter(history),
    [authSlice.name]: authSlice.reducer,
    [accountSlice.name]: createPersistReducer(
      { key: accountSlice.name, whitelistedActions: [], whitelistedKeys: [] },
      accountSlice.reducer
    ),
    [transactionsSlice.name]: createPersistReducer(
      { key: transactionsSlice.name, whitelistedActions: [], whitelistedKeys: [] },
      transactionsSlice.reducer
    ),
    [signingSlice.name]: signingSlice.reducer,
    [synchronizationSlice.name]: synchronizationSlice.reducer,
    [persistenceSlice.name]: persistenceSlice.reducer,
    [permissionsSlice.name]: createPersistReducer(
      { key: permissionsSlice.name, whitelistedActions: [], whitelistedKeys: [] },
      permissionsSlice.reducer
    ),
    [flowSlice.name]: flowSlice.reducer
  });

  return wrapRootReducer(reducer);
};

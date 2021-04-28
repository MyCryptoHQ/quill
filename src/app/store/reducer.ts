import { connectRouter } from 'connected-react-router';
import type { History } from 'history';
import type { AnyAction } from 'redux';
import { combineReducers } from 'redux';

import { createPersistReducer } from '@common/store';
import accountSlice from '@common/store/accounts.slice';
import authSlice, { logout } from '@common/store/auth.slice';
import permissionsSlice from '@common/store/permissions.slice';
import signingSlice from '@common/store/signing.slice';
import persistenceSlice from '@common/store/storage/persistence.slice';
import synchronizationSlice from '@common/store/synchronization.slice';
import transactionsSlice from '@common/store/transactions.slice';

/**
 * Wraps the combined reducer to clear state when `logout` is dispatched.
 */
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
    [permissionsSlice.name]: permissionsSlice.reducer
  });

  return (state: any, action: AnyAction) => {
    if (action.type === logout.type) {
      return reducer(undefined, action);
    }

    return reducer(state, action);
  };
};

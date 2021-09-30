import {
  accountsSlice,
  appSettingsSlice,
  authSlice,
  createPersistReducer,
  flowSlice,
  permissionsSlice,
  persistenceSlice,
  signingSlice,
  synchronizationSlice,
  transactionsSlice,
  uiSlice,
  wrapRootReducer
} from '@signer/common';
import { connectRouter } from 'connected-react-router';
import type { History } from 'history';
import { combineReducers } from 'redux';

export const createRootReducer = (history: History) => {
  const reducer = combineReducers({
    router: connectRouter(history),
    [authSlice.name]: authSlice.reducer,
    [accountsSlice.name]: createPersistReducer(
      { key: accountsSlice.name, whitelistedActions: [], whitelistedKeys: [] },
      accountsSlice.reducer
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
    [flowSlice.name]: flowSlice.reducer,
    [uiSlice.name]: uiSlice.reducer,
    [appSettingsSlice.name]: createPersistReducer(
      { key: appSettingsSlice.name, whitelistedActions: [], whitelistedKeys: [] },
      appSettingsSlice.reducer
    )
  });

  return wrapRootReducer(reducer);
};

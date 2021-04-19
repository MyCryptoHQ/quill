import { connectRouter } from 'connected-react-router';
import type { History } from 'history';
import type { AnyAction } from 'redux';
import { combineReducers } from 'redux';

import authSlice, { logout } from '@common/store/auth.slice';
import synchronizationSlice from '@common/store/synchronization.slice';

import accountSlice, { reducer as accountsReducer } from './account.slice';
import signingSlice from './signing.slice';
import transactionsSlice, { reducer as transactionsReducer } from './transactions.slice';

/**
 * Wraps the combined reducer to clear state when `logout` is dispatched.
 */
export const createRootReducer = (history: History) => {
  const reducer = combineReducers({
    router: connectRouter(history),
    [authSlice.name]: authSlice.reducer,
    [accountSlice.name]: accountsReducer,
    [transactionsSlice.name]: transactionsReducer,
    [signingSlice.name]: signingSlice.reducer,
    [synchronizationSlice.name]: synchronizationSlice.reducer
  });

  return (state: any, action: AnyAction) => {
    if (action.type === logout.type) {
      return reducer(undefined, action);
    }

    return reducer(state, action);
  };
};

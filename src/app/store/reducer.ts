import { connectRouter } from 'connected-react-router';
import type { History } from 'history';
import type { AnyAction } from 'redux';
import { combineReducers } from 'redux';
import { REHYDRATE } from 'redux-persist';

import accountSlice from '@common/store/accounts.slice';
import authSlice, { logout } from '@common/store/auth.slice';
import synchronizationSlice from '@common/store/synchronization.slice';

import signingSlice from './signing.slice';
import transactionsSlice, { reducer as transactionsReducer } from './transactions.slice';

/**
 * Wraps the combined reducer to clear state when `logout` is dispatched.
 */
export const createRootReducer = (history: History) => {
  const reducer = combineReducers({
    router: connectRouter(history),
    [authSlice.name]: authSlice.reducer,
    [accountSlice.name]: accountSlice.reducer,
    [transactionsSlice.name]: transactionsReducer,
    [signingSlice.name]: signingSlice.reducer,
    [synchronizationSlice.name]: synchronizationSlice.reducer
  });

  return (state: any, action: AnyAction) => {
    if (action.type === logout.type) {
      return reducer(undefined, action);
    } else if (action.type === REHYDRATE) {
      return { ...state, [action.key]: action.payload };
    }

    return reducer(state, action);
  };
};

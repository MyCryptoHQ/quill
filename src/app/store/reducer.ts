import { connectRouter } from 'connected-react-router';
import type { History } from 'history';
import type { AnyAction } from 'redux';
import { combineReducers } from 'redux';
import { REHYDRATE } from 'redux-persist';

import accountSlice from '@common/store/accounts.slice';
import authSlice, { logout } from '@common/store/auth.slice';
import persistenceSlice from '@common/store/persistence.slice';
import signingSlice from '@common/store/signing.slice';
import synchronizationSlice from '@common/store/synchronization.slice';
import transactionsSlice from '@common/store/transactions.slice';

/**
 * Wraps the combined reducer to clear state when `logout` is dispatched.
 */
export const createRootReducer = (history: History) => {
  const reducer = combineReducers({
    router: connectRouter(history),
    [authSlice.name]: authSlice.reducer,
    [accountSlice.name]: accountSlice.reducer,
    [transactionsSlice.name]: transactionsSlice.reducer,
    [signingSlice.name]: signingSlice.reducer,
    [synchronizationSlice.name]: synchronizationSlice.reducer,
    [persistenceSlice.name]: persistenceSlice.reducer
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

import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { AnyAction, combineReducers } from 'redux';

import synchronisationSlice from '@common/store/synchronisation';

import accountSlice, { reducer as accountsReducer } from './account.slice';
import authSlice, { logout } from './auth.slice';
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
    [synchronisationSlice.name]: synchronisationSlice.reducer
  });

  return (state: any, action: AnyAction) => {
    if (action.type === logout.type) {
      return reducer(undefined, action);
    }

    return reducer(state, action);
  };
};

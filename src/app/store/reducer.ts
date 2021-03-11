import { combineReducers } from 'redux';

import accountSlice, { reducer as accountsReducer } from './account.slice';
import authSlice, { logout } from './auth.slice';
import signingSlice from './signing.slice';
import transactionsSlice, { reducer as transactionsReducer } from './transactions.slice';

const reducer = combineReducers({
  [authSlice.name]: authSlice.reducer,
  [accountSlice.name]: accountsReducer,
  [transactionsSlice.name]: transactionsReducer,
  [signingSlice.name]: signingSlice.reducer
});

/**
 * Wraps the combined reducer to clear state when `logout` is dispatched.
 */
const rootReducer: typeof reducer = (state, action) => {
  if (action.type === logout.type) {
    return reducer(undefined, action);
  }

  return reducer(state, action);
};

export default rootReducer;

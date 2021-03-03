import { combineReducers } from 'redux';

import accountSlice, { reducer as accountsReducer } from './account.slice';
import authSlice from './auth.slice';
import signingSlice from './signing.slice';
import transactionsSlice, { reducer as transactionsReducer } from './transactions.slice';

const reducer = combineReducers({
  [authSlice.name]: authSlice.reducer,
  [accountSlice.name]: accountsReducer,
  [transactionsSlice.name]: transactionsReducer,
  [signingSlice.name]: signingSlice.reducer
});

export default reducer;

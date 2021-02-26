import { combineReducers } from 'redux';

import accountSlice, { reducer as accountsReducer } from './account.slice';
import authSlice from './auth.slice';
import transactionsSlice from './transactions.slice';

const reducer = combineReducers({
  [authSlice.name]: authSlice.reducer,
  [accountSlice.name]: accountsReducer,
  [transactionsSlice.name]: transactionsSlice.reducer
});

export default reducer;

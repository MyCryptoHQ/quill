import { combineReducers } from 'redux';

import { accountsReducer } from './account';
import { authReducer } from './auth';
import { ApplicationState } from './store';
import { txQueueReducer } from './txqueue';

const reducer = combineReducers<ApplicationState>({
  auth: authReducer,
  accounts: accountsReducer,
  queue: txQueueReducer
});

export default reducer;

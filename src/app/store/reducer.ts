import { combineReducers } from 'redux';

import { authReducer } from './auth';
import { ApplicationState } from './store';
import { txQueueReducer } from './txqueue';

const reducer = combineReducers<ApplicationState>({
  queue: txQueueReducer,
  auth: authReducer
});

export default reducer;

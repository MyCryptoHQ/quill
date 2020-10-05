import { combineReducers } from 'redux';

import { loginReducer } from './login';
import { ApplicationState } from './store';
import { txQueueReducer } from './txqueue';

const reducer = combineReducers<ApplicationState>({
  queue: txQueueReducer,
  login: loginReducer
});

export default reducer;

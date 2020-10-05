import { combineReducers } from 'redux';

import { loggedInReducer } from './loggedin';
import { ApplicationState } from './store';
import { txQueueReducer } from './txqueue';

const reducer = combineReducers<ApplicationState>({
  queue: txQueueReducer,
  loggedIn: loggedInReducer
});

export default reducer;

import { combineReducers } from 'redux';

import { ApplicationState } from './store';
import { txQueueReducer } from './txqueue';

const reducer = combineReducers<ApplicationState>({
  queue: txQueueReducer
});

export default reducer;

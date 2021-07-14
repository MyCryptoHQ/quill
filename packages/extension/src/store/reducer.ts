import { combineReducers } from 'redux';

import socketsSlice from './sockets.slice';

export const createRootReducer = () => {
  return combineReducers({
    sockets: socketsSlice.reducer
  });
};

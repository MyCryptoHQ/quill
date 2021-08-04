import { combineReducers } from 'redux';

import jsonRpcSlice from './jsonrpc.slice';
import socketsSlice from './sockets.slice';

export const createRootReducer = () => {
  return combineReducers({
    jsonrpc: jsonRpcSlice.reducer,
    sockets: socketsSlice.reducer
  });
};

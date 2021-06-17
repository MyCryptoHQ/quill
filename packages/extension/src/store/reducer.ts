import { synchronizationSlice, wrapRootReducer } from '@signer/common';
import { combineReducers } from 'redux';

export const createRootReducer = () => {
  const reducer = combineReducers({
    [synchronizationSlice.name]: synchronizationSlice.reducer
  });

  return wrapRootReducer(reducer);
};

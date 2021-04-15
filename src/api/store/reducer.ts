import { combineReducers } from '@reduxjs/toolkit';

import synchronization from '@common/store/synchronization.slice';

export const createRootReducer = () => {
  return combineReducers({
    [synchronization.name]: synchronization.reducer
  });
};

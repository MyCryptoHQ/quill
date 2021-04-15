import { combineReducers } from '@reduxjs/toolkit';

import synchronisation from '@common/store/synchronisation';

export const createRootReducer = () => {
  return combineReducers({
    [synchronisation.name]: synchronisation.reducer
  });
};

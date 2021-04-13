import { combineReducers } from '@reduxjs/toolkit';

import handshake from '@common/store/handshake';

export const createRootReducer = () => {
  return combineReducers({
    handshake: handshake.reducer
  });
};

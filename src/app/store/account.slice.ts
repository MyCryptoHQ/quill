import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';

import { IAccount } from '@types';

import { storage } from './utils';

export const initialState = [] as IAccount[];

const sliceName = 'accounts';

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    addAccount(state, action: PayloadAction<IAccount>) {
      state.push(action.payload);
    },
    removeAccount(state, action: PayloadAction<IAccount>) {
      const idx = state.findIndex((a) => a.uuid === action.payload.uuid);
      state.splice(idx, 1);
    }
  }
});

export const { addAccount, removeAccount } = slice.actions;

export default slice;

const persistConfig = {
  key: sliceName,
  keyPrefix: '',
  storage,
  serialize: false,
  deserialize: false
};

export const reducer = persistReducer(persistConfig, slice.reducer);

import { persistReducer } from 'redux-persist';

import slice from '@common/store/transactions.slice';

import { storage } from './utils';

const persistConfig = {
  key: slice.name,
  keyPrefix: '',
  storage,
  serialize: false,
  deserialize: false
};

export const persistedReducer = persistReducer(persistConfig, slice.reducer);

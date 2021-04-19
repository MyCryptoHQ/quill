import { persistReducer } from 'redux-persist';

import slice from '@common/store/accounts.slice';

import { storage } from './utils';


const persistConfig = {
    key: slice.name,
    keyPrefix: '',
    storage,
    serialize: false,
    deserialize: false,
    whitelist: ['accounts']
  };

export const persistedReducer = persistReducer(persistConfig, slice.reducer);
import type { EnhancedStore } from '@reduxjs/toolkit';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { Process, synchronizationMiddleware } from '@signer/common';
import type { ReduxIPC } from '@signer/common';
import createSagaMiddleware from 'redux-saga';

import { createRootReducer } from './reducer';
import rootSaga from './sagas';

const reducer = createRootReducer();

export type ApplicationState = ReturnType<typeof reducer>;

export const createStore = (ipc: ReduxIPC): EnhancedStore<ApplicationState> => {
  const sagaMiddleware = createSagaMiddleware();

  const store = configureStore({
    reducer,
    middleware: getDefaultMiddleware({
      thunk: false,
      serializableCheck: false
    })
      .concat(synchronizationMiddleware({ [Process.Main]: ipc }, Process.Crypto))
      .concat(sagaMiddleware)
  });

  sagaMiddleware.run(rootSaga, ipc);

  return store;
};

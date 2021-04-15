import { configureStore, EnhancedStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import { synchronisationMiddleware } from '@common/store';
import { ReduxIPC } from '@types';

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
      .concat(synchronisationMiddleware(ipc))
      .concat(sagaMiddleware)
  });

  sagaMiddleware.run(rootSaga, ipc);

  return store;
};

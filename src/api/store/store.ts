import { configureStore, EnhancedStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { ipcMain, webContents } from 'electron';
import createSagaMiddleware from 'redux-saga';

import { ipcBridgeMain } from '@bridge';
import { synchronisationMiddleware } from '@common/store';

import { createRootReducer } from './reducer';
import rootSaga from './sagas';

const reducer = createRootReducer();

export type ApplicationState = ReturnType<typeof reducer>;

export const createStore = (): EnhancedStore<ApplicationState> => {
  const sagaMiddleware = createSagaMiddleware();

  const store = configureStore({
    reducer,
    middleware: getDefaultMiddleware({
      thunk: false,
      serializableCheck: false
    })
      .concat(synchronisationMiddleware(ipcBridgeMain(ipcMain, webContents).redux))
      .concat(sagaMiddleware)
  });

  sagaMiddleware.run(rootSaga);

  return store;
};

export const store = createStore();

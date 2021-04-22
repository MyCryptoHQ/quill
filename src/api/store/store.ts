import type { EnhancedStore } from '@reduxjs/toolkit';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import { synchronizationMiddleware, SynchronizationTarget } from '@common/store';
import type { ReduxIPC } from '@types';

import { persistenceMiddleware } from './persistence.middleware';
import { createRootReducer } from './reducer';
import rootSaga from './sagas';

const reducer = createRootReducer();

export type ApplicationState = ReturnType<typeof reducer>;

export const createStore = (
  ipcs: Partial<Record<SynchronizationTarget, ReduxIPC>>
): EnhancedStore<ApplicationState> => {
  const sagaMiddleware = createSagaMiddleware();

  const store = configureStore({
    reducer,
    middleware: getDefaultMiddleware({
      thunk: false,
      serializableCheck: false
    })
      .concat(synchronizationMiddleware(ipcs, SynchronizationTarget.MAIN))
      .concat(persistenceMiddleware())
      .concat(sagaMiddleware)
  });

  sagaMiddleware.run(rootSaga, ipcs);

  return store;
};

import { configureStore, ConfigureStoreOptions, EnhancedStore } from '@reduxjs/toolkit';
import { routerMiddleware } from 'connected-react-router';
import { createHashHistory } from 'history';
import createSagaMiddleware from 'redux-saga';

import { createRootReducer } from './reducer';
import rootSaga from './sagas';

export const history = createHashHistory();

const reducer = createRootReducer(history);

export type ApplicationState = ReturnType<typeof reducer>;

export type ApplicationDispatch = ReturnType<typeof createStore>['dispatch'];

export const createStore = (
  config?: Omit<ConfigureStoreOptions<ApplicationState>, 'reducer'>
): EnhancedStore<ApplicationState> => {
  const sagaMiddleware = createSagaMiddleware();

  const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => [
      ...getDefaultMiddleware(),
      routerMiddleware(history),
      sagaMiddleware
    ],
    ...config
  });

  if (module.hot) {
    module.hot.accept('./reducer', () => {
      import('./reducer').then(({ createRootReducer: createNextRootReducer }) =>
        store.replaceReducer(createNextRootReducer(history))
      );
    });
  }

  sagaMiddleware.run(rootSaga);

  return store;
};

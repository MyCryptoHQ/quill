import { configureStore, ConfigureStoreOptions, EnhancedStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import reducer from './reducer';
import rootSaga from './sagas';

export type ApplicationState = ReturnType<typeof reducer>;

export type ApplicationDispatch = ReturnType<typeof createStore>['dispatch'];

export const createStore = (
  config?: Omit<ConfigureStoreOptions<ApplicationState>, 'reducer'>
): EnhancedStore<ApplicationState> => {
  const sagaMiddleware = createSagaMiddleware();

  const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => [...getDefaultMiddleware(), sagaMiddleware],
    ...config
  });

  if (module.hot) {
    module.hot.accept('./reducer', () => {
      import('./reducer').then(({ default: nextReducer }) => store.replaceReducer(nextReducer));
    });
  }

  sagaMiddleware.run(rootSaga);

  return store;
};

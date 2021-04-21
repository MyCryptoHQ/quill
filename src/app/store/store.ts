import type { ConfigureStoreOptions, EnhancedStore } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import { routerMiddleware } from 'connected-react-router';
import { createHashHistory } from 'history';
import createSagaMiddleware from 'redux-saga';

import { ipcBridgeRenderer } from '@bridge';
import { createKeyPair, synchronizationMiddleware, SynchronizationTarget } from '@common/store';

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
      ...getDefaultMiddleware({ thunk: false, serializableCheck: false }),
      synchronizationMiddleware(
        { [SynchronizationTarget.MAIN]: ipcBridgeRenderer.redux },
        SynchronizationTarget.RENDERER
      ),
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

  /**
   * The renderer process initialises the handshake process by generating a new key pair and sending
   * the public key to the main process (since the payload is set to `true` here).
   */
  store.dispatch(createKeyPair(true));

  return store;
};

export const store = createStore();

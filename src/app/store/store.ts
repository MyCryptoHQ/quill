import { configureStore, ConfigureStoreOptions, EnhancedStore } from '@reduxjs/toolkit';

import reducer from './reducer';

export type ApplicationState = ReturnType<typeof reducer>;

export type ApplicationDispatch = ReturnType<typeof createStore>['dispatch'];

export const createStore = (
  config?: Omit<ConfigureStoreOptions<ApplicationState>, 'reducer'>
): EnhancedStore<ApplicationState> => {
  const store = configureStore({
    reducer,
    ...config
  });

  if (module.hot) {
    module.hot.accept('./reducer', () => {
      import('./reducer').then(({ default: nextReducer }) => store.replaceReducer(nextReducer));
    });
  }

  return store;
};

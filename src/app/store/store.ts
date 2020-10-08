import { configureStore, EnhancedStore } from '@reduxjs/toolkit';

import { AccountsState } from './account';
import { AuthState } from './auth';
import reducer from './reducer';
import { TXQueueState } from './txqueue';

export interface ApplicationState {
  auth: AuthState;
  accounts: AccountsState;
  queue: TXQueueState;
}

export type ApplicationDispatch = ReturnType<typeof createStore>['dispatch'];

export const createStore = (): EnhancedStore<ApplicationState> => {
  const store = configureStore({
    reducer
  });

  if (module.hot) {
    module.hot.accept('./reducer', () => {
      import('./reducer').then(({ default: nextReducer }) => store.replaceReducer(nextReducer));
    });
  }

  return store;
};

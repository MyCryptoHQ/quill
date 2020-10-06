import { configureStore, EnhancedStore } from '@reduxjs/toolkit';

import { AuthState } from './auth';
import reducer from './reducer';
import { TXQueueState } from './txqueue';

export interface ApplicationState {
  auth: AuthState;
  queue: TXQueueState;
}

export type ApplicationDispatch = ReturnType<typeof createStore>['dispatch'];

export const createStore = (): EnhancedStore<ApplicationState> => {
  return configureStore({
    reducer
  });
};

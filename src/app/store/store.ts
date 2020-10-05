import { configureStore, EnhancedStore } from '@reduxjs/toolkit';

import { LoginState } from '@types';

import reducer from './reducer';
import { TXQueueState } from './txqueue';

export interface ApplicationState {
  login: LoginState;
  queue: TXQueueState;
}

export type ApplicationDispatch = ReturnType<typeof createStore>['dispatch'];

export const createStore = (): EnhancedStore<ApplicationState> => {
  return configureStore({
    reducer
  });
};

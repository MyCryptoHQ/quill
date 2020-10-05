import { configureStore, EnhancedStore } from '@reduxjs/toolkit';

import { LoggedInState } from './loggedin';
import reducer from './reducer';
import { TXQueueState } from './txqueue';

export interface ApplicationState {
  loggedIn: LoggedInState;
  queue: TXQueueState;
}

export type ApplicationDispatch = ReturnType<typeof createStore>['dispatch'];

export const createStore = (): EnhancedStore<ApplicationState> => {
  return configureStore({
    reducer
  });
};

import { configureStore, EnhancedStore } from '@reduxjs/toolkit';

import reducer from './reducer';
import { TXQueueState } from './txqueue';

export interface ApplicationState {
  queue: TXQueueState;
}

export type ApplicationDispatch = ReturnType<typeof createStore>['dispatch'];

export const createStore = (): EnhancedStore<ApplicationState> => {
  return configureStore({
    reducer
  });
};

// Default export for `gatsby-plugin-react-redux`
export default createStore;

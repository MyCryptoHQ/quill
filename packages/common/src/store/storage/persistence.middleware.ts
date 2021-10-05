import type { Middleware } from '@reduxjs/toolkit';

import {
  encryptSettings,
  fetchSettings,
  getPersisted,
  getWhitelistedActions,
  getWhitelistedActionsByKey,
  getWhitelistedKeys,
  rehydratedAllState,
  rehydrateState
} from '..';
import { getPersistentKeys, rehydrateAllState } from './persistence.slice';

export const persistenceMiddleware = (): Middleware => (store) => (next) => (action) => {
  if (action.type === rehydrateAllState.type) {
    const state = store.getState();

    getPersistentKeys(state).forEach((key) => store.dispatch(fetchSettings(key)));
    return next(action);
  }

  // Runs the action to make sure the state is updated
  next(action);

  const state = store.getState();
  if (action.type === rehydrateState.type && getPersisted(state)) {
    // Dispatch an action when all state is rehydrated
    return store.dispatch(rehydratedAllState());
  }

  const whitelistedActions = getWhitelistedActions(state);
  if (whitelistedActions.includes(action.type)) {
    const persistentKeys = getPersistentKeys(state);
    const key = persistentKeys.find((key) =>
      getWhitelistedActionsByKey(key)(state).includes(action.type)
    );

    const whitelistedKeys = getWhitelistedKeys(key)(state);
    const newState = Object.keys(state[key]).reduce((target, current) => {
      if (whitelistedKeys.includes(current)) {
        return { ...target, [current]: state[key][current] };
      }

      return target;
    }, {});

    store.dispatch(encryptSettings({ key, value: newState }));
  }
};

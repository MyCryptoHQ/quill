import type { Middleware } from '@reduxjs/toolkit';

import {
  encryptSettings,
  fetchSettings,
  getWhitelistedActions,
  getWhitelistedActionsByKey,
  getWhitelistedKeys
} from '..';
import { getPersistentKeys, rehydrateAllState } from './persistence.slice';

export const persistenceMiddleware = (): Middleware => (store) => (next) => (action) => {
  if (action.type === rehydrateAllState.type) {
    const state = store.getState();

    getPersistentKeys(state).forEach((key) => store.dispatch(fetchSettings(key)));
    return next(action);
  }

  // Runs the action to make sure the state is updated before it's persisted
  next(action);

  const state = store.getState();
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

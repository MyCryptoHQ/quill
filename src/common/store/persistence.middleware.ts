import type { Middleware } from '@reduxjs/toolkit';

import { loginSuccess } from './auth.slice';
import { getPersisted, getPersistor, setPersisted } from './synchronization.slice';

export const persistenceMiddleware = (): Middleware => (store) => (next) => (action) => {
  const persistor = getPersistor(store.getState());

  if (!persistor || action.type === setPersisted.type) {
    return next(action);
  }

  // Enable persistence on login
  if (action.type === loginSuccess.type) {
    persistor.persist();
  }

  const isPersisted = getPersisted(store.getState());
  const { bootstrapped } = persistor.getState();
  if (bootstrapped && !isPersisted) {
    // When redux-persist is fully ready we should tell the app that persistence is running
    store.dispatch(setPersisted(bootstrapped));
  }

  return next(action);
};

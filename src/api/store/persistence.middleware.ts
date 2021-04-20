import type { Middleware } from '@reduxjs/toolkit';

import { loginSuccess } from '@common/store';
import { getPersisted, getPersistor, setPersisted } from '@common/store/persistence.slice';

export const persistenceMiddleware = (): Middleware => (store) => (next) => (action) => {
  const persistor = getPersistor(store.getState());

  if (!persistor || action.type === setPersisted.type) {
    return next(action);
  }

  const isPersisted = getPersisted(store.getState());

  // Enable persistence on login
  if (!isPersisted && action.type === loginSuccess.type) {
    persistor.persist();
  }

  const { bootstrapped } = persistor.getState();
  if (bootstrapped && !isPersisted) {
    // When redux-persist is fully ready we should tell the app that persistence is running
    store.dispatch(setPersisted(bootstrapped));
  }

  return next(action);
};

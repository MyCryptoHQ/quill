import { Middleware } from '@reduxjs/toolkit';

import { ReduxIPC } from '@types';

/**
 * Middleware that dispatches any actions to the other Electron process.
 * @param ipc The Electron process to dispatch from.
 */
export const synchronisationMiddleware = (ipc: ReduxIPC): Middleware => (/* store */) => (next) => (
  action
) => {
  if (
    (action.type.startsWith('handshake/') && action.type !== 'handshake/sendPublicKey') ||
    action.remote
  ) {
    return next(action);
  }

  // const publicKey = getTargetPublicKey(store.getState());

  ipc.emit(JSON.stringify(action));
  return next(action);
};

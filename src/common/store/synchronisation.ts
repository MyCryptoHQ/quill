import { Middleware } from '@reduxjs/toolkit';

import handshake, {
  getHandshaken,
  getTargetPublicKey,
  sendPublicKey
} from '@common/store/handshake';
import { encryptJson } from '@common/utils';
import { ReduxIPC } from '@types';

/**
 * An array of action paths that will not be synchronised with the other process.
 */
export const IGNORED_PATHS = [handshake.name];

/**
 * Middleware that dispatches any actions to the other Electron process.
 * @param ipc The Electron process to dispatch from.
 */
export const synchronisationMiddleware = (ipc: ReduxIPC): Middleware => (store) => (next) => (
  action
) => {
  const path = action.type.split('/')[0];
  if ((action.type !== sendPublicKey.type && IGNORED_PATHS.includes(path)) || action.remote) {
    return next(action);
  }

  const json = JSON.stringify(action);

  // Only allow handshake without encryption
  if (action.type === sendPublicKey.type) {
    ipc.emit(json);
    return next(action);
  }

  const isHandshaken: boolean = getHandshaken(store.getState());
  const publicKey: string = getTargetPublicKey(store.getState());

  if (isHandshaken && publicKey) {
    const encryptedAction = encryptJson(publicKey, json);
    ipc.emit(
      JSON.stringify({
        data: encryptedAction
      })
    );
  }

  return next(action);
};

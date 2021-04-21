import type { Middleware } from '@reduxjs/toolkit';
import { PERSIST } from 'redux-persist';

import signing from '@common/store/signing.slice';
import synchronization, {
  getHandshaken,
  getTargetPublicKey,
  sendPublicKey,
  SynchronizationTarget
} from '@common/store/synchronization.slice';
import { encryptJson } from '@common/utils';
import type { ReduxIPC } from '@types';

import { setPersistor } from './persistence.slice';

/**
 * An array of action paths that will not be synchronised with the other process.
 */
export const IGNORED_PATHS = [synchronization.name];
export const IGNORED_ACTIONS = [PERSIST, setPersistor.type];

/**
 * Middleware that dispatches any actions to the other Electron process.
 * @param ipc The Electron process to dispatch from.
 */
export const synchronizationMiddleware = (
  ipc: ReduxIPC,
  self: SynchronizationTarget
): Middleware => (store) => (next) => (action) => {
  const path = action.type.split('/')[0];
  if (
    (action.type !== sendPublicKey.type && IGNORED_PATHS.includes(path)) ||
    IGNORED_ACTIONS.includes(action.type) ||
    action.remote
  ) {
    console.log('Ignoring', action.type);
    return next(action);
  }

  const json = JSON.stringify({ ...action, from: self });

  // Only allow handshake without encryption
  if (action.type === sendPublicKey.type) {
    ipc.emit(json);
    return next(action);
  }

  const target =
    self === SynchronizationTarget.MAIN
      ? path === signing.name
        ? SynchronizationTarget.SIGNING
        : SynchronizationTarget.RENDERER
      : SynchronizationTarget.MAIN;

  console.log('Sending', target, json);

  const isHandshaken: boolean = getHandshaken(target)(store.getState());
  const publicKey: string = getTargetPublicKey(target)(store.getState());

  if (isHandshaken && publicKey) {
    const encryptedAction = encryptJson(publicKey, json);
    ipc.emit(
      JSON.stringify({
        data: encryptedAction,
        from: self
      })
    );
  }

  return next(action);
};

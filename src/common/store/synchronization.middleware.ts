import type { Middleware } from '@reduxjs/toolkit';
import { PERSIST } from 'redux-persist';

import { init, sign } from '@common/store/signing.slice';
import synchronization, {
  getHandshaken,
  getTargetPublicKey,
  Process,
  sendPublicKey
} from '@common/store/synchronization.slice';
import { encryptJson } from '@common/utils';
import type { ReduxIPC } from '@types';

import { fetchAccounts } from './accounts.slice';
import { setPersistor } from './persistence.slice';

/**
 * An array of action paths that will not be synchronised with the other process.
 */
export const IGNORED_PATHS = [synchronization.name];
export const IGNORED_ACTIONS = [PERSIST, setPersistor.type];
// Certain actions that will be sent encrypted from RENDERER to CRYPTO since they contain secrets
export const CRYPTO_ACTIONS = [init.type, sign.type, fetchAccounts.type];

/**
 * Middleware that dispatches any actions to the other Electron process.
 * @param ipc The Electron process to dispatch from.
 */
export const synchronizationMiddleware = (
  processes: Partial<Record<Process, ReduxIPC>>,
  self: Process
): Middleware => (store) => (next) => (action) => {
  const path = action.type.split('/')[0];

  // CRYPTO and RENDERER only communicates with MAIN
  // MAIN communicates with both, mostly relaying requests from RENDERER
  const ipcMapping = {
    [Process.Crypto]: Process.Main,
    [Process.Main]:
      action.from === Process.Renderer || CRYPTO_ACTIONS.includes(action.type)
        ? Process.Crypto
        : Process.Renderer,
    [Process.Renderer]: Process.Main
  };

  const encryptionMapping = {
    ...ipcMapping,
    [Process.Renderer]: CRYPTO_ACTIONS.includes(action.type) ? Process.Crypto : Process.Main
  };

  const target = ipcMapping[self];

  const encryptionTarget = encryptionMapping[self];

  // UNDEFINED = ALL
  const to = action.to ?? CRYPTO_ACTIONS.includes(action.type) ? encryptionTarget : undefined;

  const from = action.from ?? self;

  if (
    (action.type !== sendPublicKey.type && IGNORED_PATHS.includes(path)) ||
    IGNORED_ACTIONS.includes(action.type) ||
    (action.remote && target === action.from) ||
    to === self ||
    (from !== self && self !== Process.Main)
  ) {
    return next(action);
  }

  // Only allow handshake without encryption
  if (action.type === sendPublicKey.type) {
    const json = JSON.stringify({ ...action, from });
    Object.entries(processes)
      .filter(([target, _]) => target !== from)
      .forEach(([_, ipc]) => ipc.emit(json));
    return next(action);
  }

  const isHandshaken: boolean = getHandshaken(encryptionTarget)(store.getState());
  const publicKey: string = getTargetPublicKey(encryptionTarget)(store.getState());

  if (isHandshaken && publicKey) {
    const json = JSON.stringify({ ...action, from, to });
    const encryptedAction = encryptJson(publicKey, json);
    processes[target].emit(
      JSON.stringify({
        data: encryptedAction,
        to,
        from
      })
    );
  }

  return next(action);
};

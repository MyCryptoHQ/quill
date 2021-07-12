import type { AnyAction, Middleware } from '@reduxjs/toolkit';

import type { ReduxIPC } from '../types';
import { encryptJson } from '../utils';
import {
  addSavedAccounts,
  clearAddAccounts,
  fetchAccounts,
  setAddAccounts
} from './accounts.slice';
import { createPassword, login } from './auth.slice';
import { decryptSettings, encryptSettings } from './settings.slice';
import { sign } from './signing.slice';
import synchronization, {
  getHandshaken,
  getTargetPublicKey,
  Process,
  sendPublicKey
} from './synchronization.slice';

/**
 * An array of action paths that will not be synchronised with the other process.
 */
export const IGNORED_PATHS = [synchronization.name];
// export const IGNORED_ACTIONS: string[] = [];

// Certain actions that will be sent encrypted from RENDERER to CRYPTO since they contain secrets
export const CRYPTO_ACTIONS = [
  sign.type,
  fetchAccounts.type,
  login.type,
  createPassword.type,
  encryptSettings.type,
  decryptSettings.type,
  setAddAccounts.type,
  clearAddAccounts.type,
  addSavedAccounts.type
];

export const CRYPTO_RENDERER_ACTIONS = [setAddAccounts.type, clearAddAccounts.type];

export const shouldIgnore = (action: AnyAction, from: Process, target: Process, self: Process) => {
  const path = action.type.split('/')[0];
  if (action.type !== sendPublicKey.type && IGNORED_PATHS.includes(path)) {
    return true;
  }

  // if (IGNORED_ACTIONS.includes(action.type)) {
  //   return true;
  // }

  if (action.remote && target === from) {
    return true;
  }

  if (from !== self && self !== Process.Main) {
    return true;
  }

  return false;
};

/**
 * Middleware that dispatches any actions to the other Electron process.
 *
 * @param processes
 * @param self
 */
export const synchronizationMiddleware = (
  processes: Partial<Record<Process, ReduxIPC>>,
  self: Process
): Middleware => (store) => (next) => (action) => {
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
    [Process.Renderer]: CRYPTO_ACTIONS.includes(action.type) ? Process.Crypto : Process.Main,
    [Process.Crypto]: CRYPTO_RENDERER_ACTIONS.includes(action.type)
      ? Process.Renderer
      : Process.Main
  };

  const target = ipcMapping[self];
  const encryptionTarget = encryptionMapping[self];

  // UNDEFINED = ALL
  const to = action.to ?? CRYPTO_ACTIONS.includes(action.type) ? encryptionTarget : undefined;
  const from = action.from ?? self;

  if (shouldIgnore(action, from, target, self)) {
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

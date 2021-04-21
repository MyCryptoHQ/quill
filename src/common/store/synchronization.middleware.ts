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
export const SIGNING_PATHS = [signing.name];

/**
 * Middleware that dispatches any actions to the other Electron process.
 * @param ipc The Electron process to dispatch from.
 */
export const synchronizationMiddleware = (
  ipcs: Partial<Record<SynchronizationTarget, ReduxIPC>>,
  self: SynchronizationTarget
): Middleware => (store) => (next) => (action) => {
  const path = action.type.split('/')[0];

  // SIGNING and RENDERER only communicates with MAIN
  // MAIN communicates with both
  const targetMapping = {
    [SynchronizationTarget.SIGNING]: SynchronizationTarget.MAIN,
    [SynchronizationTarget.MAIN]: SIGNING_PATHS.includes(path)
      ? SynchronizationTarget.SIGNING
      : SynchronizationTarget.RENDERER,
    [SynchronizationTarget.RENDERER]: SynchronizationTarget.MAIN
  };

  const target = targetMapping[self];

  if (
    (action.type !== sendPublicKey.type && IGNORED_PATHS.includes(path)) ||
    IGNORED_ACTIONS.includes(action.type) ||
    (action.remote && target === action.from)
  ) {
    console.log(self, 'Ignoring', target, action.type);
    return next(action);
  }

  const json = JSON.stringify({ ...action, from: self });

  console.log(self, 'Sending', target, json);

  // Only allow handshake without encryption
  if (action.type === sendPublicKey.type) {
    Object.values(ipcs).forEach(ipc => ipc.emit(json));
    return next(action);
  }

  const isHandshaken: boolean = getHandshaken(target)(store.getState());
  const publicKey: string = getTargetPublicKey(target)(store.getState());

  if (isHandshaken && publicKey) {
    const encryptedAction = encryptJson(publicKey, json);
    ipcs[target].emit(
      JSON.stringify({
        data: encryptedAction,
        from: self
      })
    );
  }else{
    console.log(self, "Send Failed", target, isHandshaken, publicKey)
  }

  return next(action);
};

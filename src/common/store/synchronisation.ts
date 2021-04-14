import { hexlify } from '@ethersproject/bytes';
import { Middleware } from '@reduxjs/toolkit';
import { encrypt } from 'eciesjs';

import { getHandshaken, getTargetPublicKey } from '@common/store/handshake';
import { ReduxIPC } from '@types';

/**
 * Middleware that dispatches any actions to the other Electron process.
 * @param ipc The Electron process to dispatch from.
 */
export const synchronisationMiddleware = (ipc: ReduxIPC): Middleware => (store) => (next) => (
  action
) => {
  if (
    (action.type.startsWith('handshake/') && action.type !== 'handshake/sendPublicKey') ||
    action.remote
  ) {
    return next(action);
  }

  const json = JSON.stringify(action);

  // Only allow handshake without encryption
  if (action.type === 'handshake/sendPublicKey') {
    ipc.emit(json);
    return next(action);
  }

  const isHandshaken: boolean = getHandshaken(store.getState());
  const publicKey: string = getTargetPublicKey(store.getState());

  if (isHandshaken && publicKey) {
    const encryptedAction = encrypt(publicKey, Buffer.from(json, 'utf-8'));
    ipc.emit(
      JSON.stringify({
        data: hexlify(encryptedAction)
      })
    );
  }

  return next(action);
};

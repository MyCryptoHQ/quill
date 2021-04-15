/**
 * @jest-environment node
 */

import configureStore from 'redux-mock-store';

import { synchronizationMiddleware } from '@common/store/synchronization.middleware';
import { sendPublicKey, setHandshaken } from '@common/store/synchronization.slice';
import { decryptJson } from '@common/utils';
import { fEncryptionPrivateKey, fEncryptionPublicKey } from '@fixtures';
import type { ApplicationState } from '@store';
import { DeepPartial } from '@types';

import { checkNewUser } from './actions';

const createMockStore = configureStore<DeepPartial<ApplicationState>>();

afterEach(() => {
  jest.clearAllMocks();
});

describe('synchronizationMiddleware', () => {
  const ipc = {
    emit: jest.fn(),
    on: jest.fn(),
    handle: jest.fn()
  };

  it('emits the unencrypted action if the action is synchronization/sendPublicKey', () => {
    const fn = jest.fn();
    const action = sendPublicKey(fEncryptionPublicKey);

    synchronizationMiddleware(ipc)(createMockStore())(fn)(action);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(action);
    expect(ipc.emit).toHaveBeenCalledTimes(1);
    expect(ipc.emit).toHaveBeenCalledWith(JSON.stringify(action));
  });

  it('emits the encrypted action if the handshake is performed', () => {
    const fn = jest.fn();
    const action = checkNewUser();

    synchronizationMiddleware(ipc)(
      createMockStore({
        synchronization: {
          isHandshaken: true,
          targetPublicKey: fEncryptionPublicKey
        }
      })
    )(fn)(action);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(action);
    expect(ipc.emit).toHaveBeenCalledTimes(1);

    const encryptedJson = ipc.emit.mock.calls[0][0];

    expect(JSON.parse(decryptJson(fEncryptionPrivateKey, JSON.parse(encryptedJson)))).toEqual(
      checkNewUser()
    );
  });

  it('does nothing if the handshake is not performed', () => {
    const fn = jest.fn();
    const action = checkNewUser();

    synchronizationMiddleware(ipc)(
      createMockStore({
        synchronization: {
          isHandshaken: false
        }
      })
    )(fn)(action);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(action);
    expect(ipc.emit).not.toHaveBeenCalled();
  });

  it('does nothing if the action is remote or part of the handshake', () => {
    const fn = jest.fn();

    synchronizationMiddleware(ipc)(createMockStore())(fn)(setHandshaken(true));

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(setHandshaken(true));
    expect(ipc.emit).not.toHaveBeenCalled();

    synchronizationMiddleware(ipc)(createMockStore())(fn)({ ...checkNewUser(), remote: true });

    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenCalledWith({ ...checkNewUser(), remote: true });
    expect(ipc.emit).not.toHaveBeenCalled();
  });
});

/**
 * @jest-environment node
 */

import configureStore from 'redux-mock-store';

import { checkNewUser } from '@common/store';
import { synchronizationMiddleware } from '@common/store/synchronization.middleware';
import { Process, sendPublicKey, setHandshaken } from '@common/store/synchronization.slice';
import { decryptJson } from '@common/utils';
import { fEncryptionPrivateKey, fEncryptionPublicKey } from '@fixtures';
import type { ApplicationState } from '@store';
import type { DeepPartial } from '@types';

const createMockStore = configureStore<DeepPartial<ApplicationState>>();

afterEach(() => {
  jest.clearAllMocks();
});

describe('synchronizationMiddleware', () => {
  const processes = {
    [Process.Renderer]: {
      emit: jest.fn(),
      on: jest.fn()
    },
    [Process.Crypto]: {
      emit: jest.fn(),
      on: jest.fn()
    }
  };

  const self = Process.Main;

  it('emits the unencrypted action to all ipcs if the action is synchronization/sendPublicKey', () => {
    const fn = jest.fn();
    const action = sendPublicKey(fEncryptionPublicKey);

    synchronizationMiddleware(processes, self)(createMockStore())(fn)(action);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(action);
    Object.values(processes).map((ipc) => expect(ipc.emit).toHaveBeenCalledTimes(1));
    Object.values(processes).map((ipc) =>
      expect(ipc.emit).toHaveBeenCalledWith(JSON.stringify({ ...action, from: self }))
    );
  });

  it('emits the encrypted action if the handshake is performed', () => {
    const fn = jest.fn();
    const action = checkNewUser();

    const ipc = { emit: jest.fn(), on: jest.fn() };

    synchronizationMiddleware(
      { [Process.Main]: ipc },
      Process.Renderer
    )(
      createMockStore({
        synchronization: {
          isHandshaken: { [Process.Main]: true },
          targetPublicKey: { [Process.Main]: fEncryptionPublicKey }
        }
      })
    )(fn)(action);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(action);
    expect(ipc.emit).toHaveBeenCalledTimes(1);

    const encryptedJson = ipc.emit.mock.calls[0][0];

    expect(JSON.parse(decryptJson(fEncryptionPrivateKey, JSON.parse(encryptedJson)))).toEqual({
      ...checkNewUser(),
      from: Process.Renderer
    });
  });

  it('does nothing if the handshake is not performed', () => {
    const fn = jest.fn();
    const action = checkNewUser();

    synchronizationMiddleware(
      processes,
      self
    )(
      createMockStore({
        synchronization: {
          isHandshaken: {},
          targetPublicKey: {}
        }
      })
    )(fn)(action);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(action);
    Object.values(processes).map((i) => expect(i.emit).not.toHaveBeenCalled());
  });

  it('does nothing if the action is remote or part of the handshake', () => {
    const fn = jest.fn();

    const action = setHandshaken({ target: Process.Main, isHandshaken: true });

    const state = {
      synchronization: {
        isHandshaken: {},
        targetPublicKey: {}
      }
    };

    synchronizationMiddleware(processes, self)(createMockStore(state))(fn)(action);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(action);
    Object.values(processes).map((ipc) => expect(ipc.emit).not.toHaveBeenCalled());

    synchronizationMiddleware(processes, self)(createMockStore(state))(fn)({
      ...checkNewUser(),
      remote: true
    });

    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenCalledWith({ ...checkNewUser(), remote: true });
    Object.values(processes).map((ipc) => expect(ipc.emit).not.toHaveBeenCalled());
  });
});

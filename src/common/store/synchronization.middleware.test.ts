/**
 * @jest-environment node
 */

import configureStore from 'redux-mock-store';

import { checkNewUser } from '@common/store';
import { synchronizationMiddleware } from '@common/store/synchronization.middleware';
import {
  sendPublicKey,
  setHandshaken,
  SynchronizationTarget
} from '@common/store/synchronization.slice';
import { decryptJson } from '@common/utils';
import { fEncryptionPrivateKey, fEncryptionPublicKey } from '@fixtures';
import type { ApplicationState } from '@store';
import type { DeepPartial } from '@types';

const createMockStore = configureStore<DeepPartial<ApplicationState>>();

afterEach(() => {
  jest.clearAllMocks();
});

describe('synchronizationMiddleware', () => {
  const ipcs = {
    [SynchronizationTarget.RENDERER]: {
      emit: jest.fn(),
      on: jest.fn(),
      handle: jest.fn()
    },
    [SynchronizationTarget.SIGNING]: {
      emit: jest.fn(),
      on: jest.fn(),
      handle: jest.fn()
    }
  };

  const self = SynchronizationTarget.MAIN;

  it('emits the unencrypted action to all ipcs if the action is synchronization/sendPublicKey', () => {
    const fn = jest.fn();
    const action = sendPublicKey(fEncryptionPublicKey);

    synchronizationMiddleware(ipcs, self)(createMockStore())(fn)(action);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(action);
    Object.values(ipcs).map((ipc) => expect(ipc.emit).toHaveBeenCalledTimes(1));
    Object.values(ipcs).map((ipc) =>
      expect(ipc.emit).toHaveBeenCalledWith(JSON.stringify({ ...action, from: self }))
    );
  });

  it('emits the encrypted action if the handshake is performed', () => {
    const fn = jest.fn();
    const action = checkNewUser();

    const ipc = { emit: jest.fn(), on: jest.fn(), handle: jest.fn() };

    synchronizationMiddleware(
      { [SynchronizationTarget.MAIN]: ipc },
      SynchronizationTarget.RENDERER
    )(
      createMockStore({
        synchronization: {
          isHandshaken: { [SynchronizationTarget.MAIN]: true },
          targetPublicKey: { [SynchronizationTarget.MAIN]: fEncryptionPublicKey }
        }
      })
    )(fn)(action);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(action);
    expect(ipc.emit).toHaveBeenCalledTimes(1);

    const encryptedJson = ipc.emit.mock.calls[0][0];

    expect(JSON.parse(decryptJson(fEncryptionPrivateKey, JSON.parse(encryptedJson)))).toEqual({
      ...checkNewUser(),
      from: SynchronizationTarget.RENDERER
    });
  });

  it('does nothing if the handshake is not performed', () => {
    const fn = jest.fn();
    const action = checkNewUser();

    synchronizationMiddleware(
      ipcs,
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
    Object.values(ipcs).map((i) => expect(i.emit).not.toHaveBeenCalled());
  });

  it('does nothing if the action is remote or part of the handshake', () => {
    const fn = jest.fn();

    const action = setHandshaken({ target: SynchronizationTarget.MAIN, isHandshaken: true });

    const state = {
      synchronization: {
        isHandshaken: {},
        targetPublicKey: {}
      }
    };

    synchronizationMiddleware(ipcs, self)(createMockStore(state))(fn)(action);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(action);
    Object.values(ipcs).map((ipc) => expect(ipc.emit).not.toHaveBeenCalled());

    synchronizationMiddleware(ipcs, self)(createMockStore(state))(fn)({
      ...checkNewUser(),
      remote: true
    });

    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenCalledWith({ ...checkNewUser(), remote: true });
    Object.values(ipcs).map((ipc) => expect(ipc.emit).not.toHaveBeenCalled());
  });
});

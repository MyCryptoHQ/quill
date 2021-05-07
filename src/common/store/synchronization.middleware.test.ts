/**
 * @jest-environment node
 */

import configureStore from 'redux-mock-store';

import { checkNewUser, login, setAccountsToAdd } from '@common/store';
import { shouldIgnore, synchronizationMiddleware } from '@common/store/synchronization.middleware';
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

  it('emits CRYPTO_ACTIONS encrypted for CRYPTO', () => {
    const fn = jest.fn();
    const action = login('foo');

    const ipc = { emit: jest.fn(), on: jest.fn() };

    synchronizationMiddleware(
      { [Process.Main]: ipc },
      Process.Renderer
    )(
      createMockStore({
        synchronization: {
          isHandshaken: { [Process.Crypto]: true },
          targetPublicKey: { [Process.Crypto]: fEncryptionPublicKey }
        }
      })
    )(fn)(action);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(action);
    expect(ipc.emit).toHaveBeenCalledTimes(1);

    const encryptedJson = ipc.emit.mock.calls[0][0];

    expect(JSON.parse(decryptJson(fEncryptionPrivateKey, JSON.parse(encryptedJson)))).toEqual({
      ...action,
      from: Process.Renderer,
      to: Process.Crypto
    });
  });

  it('emits CRYPTO_RENDERER_ACTIONS encrypted for RENDERER', () => {
    const fn = jest.fn();
    const action = setAccountsToAdd([]);

    const ipc = { emit: jest.fn(), on: jest.fn() };

    synchronizationMiddleware(
      { [Process.Main]: ipc },
      Process.Crypto
    )(
      createMockStore({
        synchronization: {
          isHandshaken: { [Process.Renderer]: true },
          targetPublicKey: { [Process.Renderer]: fEncryptionPublicKey }
        }
      })
    )(fn)(action);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(action);
    expect(ipc.emit).toHaveBeenCalledTimes(1);

    const encryptedJson = ipc.emit.mock.calls[0][0];

    expect(JSON.parse(decryptJson(fEncryptionPrivateKey, JSON.parse(encryptedJson)))).toEqual({
      ...action,
      from: Process.Crypto,
      to: Process.Renderer
    });
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

describe('shouldIgnore', () => {
  it('ignores IGNORED_PATHS', () => {
    expect(
      shouldIgnore(
        setHandshaken({ target: Process.Main, isHandshaken: true }),
        Process.Renderer,
        Process.Main,
        Process.Renderer
      )
    ).toBe(true);
  });

  // Commented out since there are no ignored actions currently
  // eslint-disable-next-line jest/no-commented-out-tests
  // it('ignores IGNORED_ACTIONS', () => {
  //   expect(
  //     shouldIgnore(rehydrateAllState(undefined), Process.Main, Process.Renderer, Process.Main)
  //   ).toBe(true);
  // });

  it('ignores actions that would be dispatched back to where they came from', () => {
    expect(
      shouldIgnore(
        { ...checkNewUser(), remote: true },
        Process.Renderer,
        Process.Renderer,
        Process.Main
      )
    ).toBe(true);
  });

  it('ignores actions that come from elsewhere unless it is the main process', () => {
    expect(shouldIgnore(checkNewUser(), Process.Renderer, Process.Main, Process.Crypto)).toBe(true);
    expect(shouldIgnore(checkNewUser(), Process.Renderer, Process.Crypto, Process.Main)).toBe(
      false
    );
  });
});

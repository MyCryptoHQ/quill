import { ipcMain } from 'electron';
import Store from 'electron-store';
import fs from 'fs';
import keytar, { deletePassword } from 'keytar';

import { IPC_CHANNELS, KEYTAR_SERVICE } from '@config';
import { fAccount, fPrivateKey } from '@fixtures';
import type { TUuid } from '@types';
import { DBRequestType, WalletType } from '@types';

import type { handleRequest as _handleRequest, runService as _runService } from './db';

jest.mock('path');

jest.mock('crypto', () => ({
  ...jest.requireActual('crypto'),
  randomBytes: jest.fn().mockImplementation(() => Buffer.from('2d21938ada7a165c39c8f3fd', 'hex'))
}));

jest.mock('electron', () => ({
  app: {
    getPath: jest.fn()
  },
  ipcMain: {
    handle: jest.fn().mockImplementation((_e, callback) => {
      callback();
    })
  }
}));

jest.mock('fs', () => ({
  promises: {
    stat: jest
      .fn()
      .mockImplementationOnce(() => Promise.reject())
      .mockImplementation(() => Promise.resolve(true)),
    unlink: jest.fn().mockImplementation(() => Promise.resolve())
  }
}));

const mockSet = jest.fn();
const mockClear = jest.fn();

jest.mock('electron-store', () => {
  return jest.fn().mockImplementation(() => ({
    get: jest.fn().mockImplementation((key: string) => {
      if (key === 'accounts') {
        return '993e330609e9c288dc09665834aa71db839fa9c05d647d2b44e41ab5a175e822214848289b445d3a467af53ce6cd8baaaf0f932f45715ef84c22aa4533ba9c9a4efa224b6fdb6df0b3bece0cf65d682756daef518f837662163a1056e1dc9fe52a96677b561ae2c8fdd2a62332d1aca1b54f844b4354a7a858bbb29b07ae36c41ab41ace849bbc8f08e1bfb05176c2644d7cdcbe571f78827ad7cacc48cc1411e84319a42e931d42006a89edb838a5251bed742b9e6e9f4d421603806a6fe932c1de5d6f93cbfb2bb5249a52b88db8bf0050440d2d21938ada7a165c39c8f3fd';
      }
      return {};
    }),
    set: mockSet,
    clear: mockClear
  }));
});

jest.mock('keytar', () => ({
  setPassword: jest.fn(),
  getPassword: jest
    .fn()
    .mockImplementation(
      () =>
        'd2646b5608b580d69919225a2aed278f809bf5c60660622c11ec1aaead27ef2038161f2c97585a621279f36db5c2defcfb0d86730d674fbe1276bd4c20b6ccca4af53b6605c124747520bfe5abf64d288b272d21938ada7a165c39c8f3fd'
    ),
  deletePassword: jest.fn(),
  findCredentials: jest.fn().mockReturnValue([{ account: 'foo' }])
}));

const uuid = '304a57a4-1752-53db-8861-67785534e98e' as TUuid;
const password = 'password';
const privateKey = '0x93b3701cf8eeb6f7d3b22211c691734f24816a02efa933f67f34d37053182577';
const encryptedPrivKey =
  'd2646b5608b580d69919225a2aed278f809bf5c60660622c11ec1aaead27ef2038161f2c97585a621279f36db5c2defcfb0d86730d674fbe1276bd4c20b6ccca4af53b6605c124747520bfe5abf64d288b272d21938ada7a165c39c8f3fd';

const { handleRequest, runService } = jest.requireActual<{
  handleRequest: typeof _handleRequest;
  runService: typeof _runService;
}>('./db');

describe('handleRequest', () => {
  it('get login state returns logged out correctly', async () => {
    const result = await handleRequest({ type: DBRequestType.IS_LOGGED_IN });
    expect(result).toBe(false);
  });

  it('init succesfully initializes the electron-store', async () => {
    const result = await handleRequest({ type: DBRequestType.INIT, password });
    expect(result).toBe(true);
    expect(Store).toHaveBeenCalled();
  });

  it('init fails with no input', async () => {
    const result = await handleRequest({ type: DBRequestType.INIT, password: '' });
    expect(result).toBe(false);
  });

  it('login succesfully initializes the electron-store', async () => {
    const result = await handleRequest({ type: DBRequestType.LOGIN, password });
    expect(result).toBe(true);
    expect(Store).toHaveBeenCalled();
  });

  it('login fails with wrong password', async () => {
    const result = await handleRequest({ type: DBRequestType.LOGIN, password: 'bla' });
    expect(result).toBe(false);
  });

  it('login fails with empty password', async () => {
    const result = await handleRequest({ type: DBRequestType.LOGIN, password: '' });
    expect(result).toBe(false);
  });

  it('logout clears the encryption key', async () => {
    await handleRequest({ type: DBRequestType.LOGIN, password });
    await expect(handleRequest({ type: DBRequestType.IS_LOGGED_IN })).resolves.toBe(true);

    await handleRequest({ type: DBRequestType.LOGOUT });
    await expect(handleRequest({ type: DBRequestType.IS_LOGGED_IN })).resolves.toBe(false);
  });

  it('reset correctly resets the Store', async () => {
    await handleRequest({ type: DBRequestType.RESET });
    expect(fs.promises.unlink).toHaveBeenCalled();
    expect(mockClear).toHaveBeenCalled();

    expect(deletePassword).toHaveBeenCalledWith(KEYTAR_SERVICE, 'foo');
  });

  it('get new user state returns true default', async () => {
    const result = await handleRequest({ type: DBRequestType.IS_NEW_USER });
    expect(result).toBe(true);
  });

  it('get new user state returns false afterwards', async () => {
    const result = await handleRequest({ type: DBRequestType.IS_NEW_USER });
    expect(result).toBe(false);
  });

  it('get login state returns logged in correctly', async () => {
    const initResult = await handleRequest({ type: DBRequestType.INIT, password });
    expect(initResult).toBe(true);
    const result = await handleRequest({ type: DBRequestType.IS_LOGGED_IN });
    expect(result).toBe(true);
  });

  it('get from store', async () => {
    const initResult = await handleRequest({ type: DBRequestType.INIT, password });
    expect(initResult).toBe(true);
    const result = await handleRequest({ type: DBRequestType.GET_FROM_STORE, key: 'accounts' });
    expect(result).toStrictEqual({ accounts: { [fAccount.uuid]: fAccount } });
  });

  it('set in store', async () => {
    const initResult = await handleRequest({ type: DBRequestType.INIT, password });
    expect(initResult).toBe(true);
    await handleRequest({
      type: DBRequestType.SET_IN_STORE,
      key: 'accounts',
      payload: { accounts: { [fAccount.uuid]: fAccount } }
    });
    expect(mockSet).toHaveBeenCalledWith(
      'accounts',
      '993e330609e9c288dc09665834aa71db839fa9c05d647d2b44e41ab5a175e822214848289b445d3a467af53ce6cd8baaaf0f932f45715ef84c22aa4533ba9c9a4efa224b6fdb6df0b3bece0cf65d682756daef518f837662163a1056e1dc9fe52a96677b561ae2c8fdd2a62332d1aca1b54f844b4354a7a858bbb29b07ae36c41ab41ace849bbc8f08e1bfb05176c2644d7cdcbe571f78827ad7cacc48cc1411e84319a42e931d42006a89edb838a5251bed742b9e6e9f4d421603806a6fe932c1de5d6f93cbfb2bb5249a52b88db8bf0050440d2d21938ada7a165c39c8f3fd'
    );
  });

  it('set in store does not set without an encryption key', async () => {
    mockSet.mockClear();

    // Ensure there is no encryption key set
    await handleRequest({ type: DBRequestType.LOGOUT });
    await handleRequest({
      type: DBRequestType.SET_IN_STORE,
      key: 'accounts',
      payload: { accounts: { [fAccount.uuid]: fAccount } }
    });

    expect(mockSet).not.toHaveBeenCalled();
  });

  it('SAVE_ACCOUNT_SECRETS calls setPassword with encrypted privkey', async () => {
    await handleRequest({
      type: DBRequestType.INIT,
      password
    });

    await handleRequest({
      type: DBRequestType.SAVE_ACCOUNT_SECRETS,
      wallet: {
        walletType: WalletType.PRIVATE_KEY,
        privateKey
      }
    });

    expect(keytar.setPassword).toHaveBeenCalledWith(KEYTAR_SERVICE, uuid, encryptedPrivKey);
  });

  it('GET_PRIVATE_KEY returns decrypted private key', async () => {
    await handleRequest({
      type: DBRequestType.INIT,
      password
    });

    const response = await handleRequest({
      type: DBRequestType.GET_PRIVATE_KEY,
      uuid
    });

    expect(keytar.getPassword).toHaveBeenCalledWith(KEYTAR_SERVICE, uuid);
    expect(response).toBe(privateKey);
  });

  it('DELETE_ACCOUNT_SECRETS calls deletePassword', async () => {
    await handleRequest({
      type: DBRequestType.DELETE_ACCOUNT_SECRETS,
      uuid
    });

    expect(keytar.deletePassword).toHaveBeenCalledWith(KEYTAR_SERVICE, uuid);
  });

  it('errors if non supported type is passed', async () => {
    await expect(
      handleRequest({
        // @ts-expect-error Unsupported type
        type: 'bla',
        privateKey: fPrivateKey
      })
    ).rejects.toBeDefined();
  });
});

describe('runService', () => {
  it('calls ipcMain handle', () => {
    runService();
    expect(ipcMain.handle).toHaveBeenCalledWith(IPC_CHANNELS.DATABASE, expect.any(Function));
  });
});

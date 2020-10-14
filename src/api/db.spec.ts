import { ipcMain } from 'electron';
import Store from 'electron-store';
import keytar from 'keytar';

import { IPC_CHANNELS, KEYTAR_SERVICE } from '@config';
import { fAccount } from '@fixtures';
import { DBRequestType, TUuid } from '@types';

import { handleRequest, runService } from './db';

jest.mock('path');

jest.mock('electron', () => ({
  app: {
    getPath: jest.fn()
  },
  ipcMain: {
    handle: jest.fn()
  }
}));

jest.mock('fs', () => ({
  promises: {
    stat: jest.fn().mockImplementation(() => Promise.resolve(false))
  }
}));

jest.mock('electron-store', () => {
  return jest.fn().mockImplementation(() => ({
    get: jest.fn().mockImplementation((key: string) => {
      if (key === 'accounts') {
        return 'e900fe0064bf8376f1f77b0b9fb598326c77d5959e32f31ab5f8f5b5e42275686c1d91e7d4cf6a1764ccd687eb2c185362e4744080a94efb620e44f4c06ec9bf3be1fc6b3a0e5d7071fe30fedfc33cca5d464206f0ee2fe96110f43a0be71561a538e8966168687427e57de3c83587be6e40059c739dcfa0d29c914a632064af04da6f4eda99ac9364278e487b4a9fc0dde27d1a05c8590d56b60f399d6fed05d4d39b3dd010f2feedb4b92d9f1d09b0506bfa21297610';
      }
      return {};
    }),
    set: jest.fn(),
    clear: jest.fn()
  }));
});

jest.mock('keytar', () => ({
  setPassword: jest.fn(),
  getPassword: jest.fn().mockImplementation(() => 'e250a3146ae9c2'),
  deletePassword: jest.fn()
}));

const uuid = 'a259a13e-936b-5945-8c80-7f757e808507' as TUuid;
const password = 'password';
const privateKey = 'privkey';
const encryptedPrivKey = 'e250a3146ae9c2';

describe('handleRequest', () => {
  it('get login state returns logged out correctly', async () => {
    const result = await handleRequest({ type: DBRequestType.IS_LOGGED_IN });
    expect(result).toBe(false);
  });

  it('init succesfully initializes the electron-store', async () => {
    const result = await handleRequest({ type: DBRequestType.INIT, password: 'password' });
    expect(result).toBe(true);
    expect(Store).toHaveBeenCalled();
  });

  it('login succesfully initializes the electron-store', async () => {
    const result = await handleRequest({ type: DBRequestType.LOGIN, password });
    expect(result).toBe(true);
    expect(Store).toHaveBeenCalled();
  });

  it('get new user state returns true default', async () => {
    const result = await handleRequest({ type: DBRequestType.IS_NEW_USER });
    expect(result).toBe(true);
  });

  it('get login state returns logged in correctly', async () => {
    const initResult = await handleRequest({ type: DBRequestType.INIT, password });
    expect(initResult).toBe(true);
    const result = await handleRequest({ type: DBRequestType.IS_LOGGED_IN });
    expect(result).toBe(true);
  });

  it('get accounts', async () => {
    const initResult = await handleRequest({ type: DBRequestType.INIT, password });
    expect(initResult).toBe(true);
    const result = await handleRequest({ type: DBRequestType.GET_ACCOUNTS });
    expect(result).toStrictEqual({ [fAccount.uuid]: fAccount });
  });

  it('SAVE_PRIVATE_KEY calls setPassword with encrypted privkey', async () => {
    await handleRequest({
      type: DBRequestType.INIT,
      password
    });

    await handleRequest({
      type: DBRequestType.SAVE_PRIVATE_KEY,
      uuid,
      privateKey
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

  it('DELETE_PRIVATE_KEY calls deletePassword', async () => {
    await handleRequest({
      type: DBRequestType.DELETE_PRIVATE_KEY,
      uuid
    });

    expect(keytar.deletePassword).toHaveBeenCalledWith(KEYTAR_SERVICE, uuid);
  });
});

describe('runService', () => {
  it('calls ipcMain handle', () => {
    runService();
    expect(ipcMain.handle).toHaveBeenCalledWith(IPC_CHANNELS.DATABASE, expect.any(Function));
  });
});

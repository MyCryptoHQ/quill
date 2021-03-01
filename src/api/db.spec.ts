import { ipcMain } from 'electron';
import Store from 'electron-store';
import fs from 'fs';
import keytar from 'keytar';

import { IPC_CHANNELS, KEYTAR_SERVICE } from '@config';
import { fAccount } from '@fixtures';
import { DBRequestType, TUuid, WalletType } from '@types';

import { handleRequest as _handleRequest, runService as _runService } from './db';

jest.mock('path');

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
        return 'e900ab0162e3ce2dbcb2740480aecf7d3c27dd918a3cbb1fe5eca7a1b570266e731392b2d2d679147bdfc0c5b07e5c0c72e4341fc8b30eb73d4753aadb3986ef6be9f87f3446582065ac24af8d903ad553451700e9fd3aaf3117a77a58f20371ab38f4cc346e6e6307d43ef7c472f3f6636050b873bbcfa186bfe6431f2736de75886f3dfebead9c1057d9486d508df0e2f32a0e0edf3b6f3dcc6c19a140c362b7d3e74de923c1d9c198860da84b07a8466fe421257819ff8177475034731dd61a8c37c4';
      }
      return {};
    }),
    set: mockSet,
    clear: mockClear
  }));
});

jest.mock('keytar', () => ({
  setPassword: jest.fn(),
  getPassword: jest.fn().mockImplementation(() => 'a25af35163bf8c73f9a230069ee999293f238197d138a418b0e4a7bab922216c6a4dc5b6deca7e4c2fdcc694e371095a26e6214380a51ff1631344a3c835d6bf6fe6'),
  deletePassword: jest.fn()
}));

const uuid = '304a57a4-1752-53db-8861-67785534e98e' as TUuid;
const password = 'password';
const privateKey = '0x93b3701cf8eeb6f7d3b22211c691734f24816a02efa933f67f34d37053182577';
const encryptedPrivKey = 'a25af35163bf8c73f9a230069ee999293f238197d138a418b0e4a7bab922216c6a4dc5b6deca7e4c2fdcc694e371095a26e6214380a51ff1631344a3c835d6bf6fe6';

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

  it('reset correctly resets the Store', async () => {
    await handleRequest({ type: DBRequestType.RESET });
    expect(fs.promises.unlink).toHaveBeenCalled();
    expect(mockClear).toHaveBeenCalled();
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
      'e900ab0162e3ce2dbcb2740480aecf7d3c27dd918a3cbb1fe5eca7a1b570266e731392b2d2d679147bdfc0c5b07e5c0c72e4341fc8b30eb73d4753aadb3986ef6be9f87f3446582065ac24af8d903ad553451700e9fd3aaf3117a77a58f20371ab38f4cc346e6e6307d43ef7c472f3f6636050b873bbcfa186bfe6431f2736de75886f3dfebead9c1057d9486d508df0e2f32a0e0edf3b6f3dcc6c19a140c362b7d3e74de923c1d9c198860da84b07a8466fe421257819ff8177475034731dd61a8c37c4'
    );
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
        privateKey: 'privkey'
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

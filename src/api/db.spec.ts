import Store from 'electron-store';

import { DBRequestType } from '@types';

import { handleRequest } from './db';

jest.mock('path');

jest.mock('electron', () => ({
  app: {
    getPath: jest.fn()
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
        return [];
      }
      return {};
    }),
    set: jest.fn()
  }));
});

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
    const result = await handleRequest({ type: DBRequestType.LOGIN, password: 'password' });
    expect(result).toBe(true);
    expect(Store).toHaveBeenCalled();
  });

  it('get new user state returns true default', async () => {
    const result = await handleRequest({ type: DBRequestType.IS_NEW_USER });
    expect(result).toBe(true);
  });

  it('get login state returns logged in correctly', async () => {
    const initResult = await handleRequest({ type: DBRequestType.INIT, password: 'password' });
    expect(initResult).toBe(true);
    const result = await handleRequest({ type: DBRequestType.IS_LOGGED_IN });
    expect(result).toBe(true);
  });

  it('get accounts', async () => {
    const result = await handleRequest({ type: DBRequestType.GET_ACCOUNTS });
    // @todo
    expect(result).toStrictEqual([]);
  });
});

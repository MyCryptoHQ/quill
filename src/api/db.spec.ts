import Store from 'electron-store';

import { DBRequestType, LoginState } from '@types';

import { testables } from './db';

const handleRequest = testables.handleRequest;

jest.mock('path');

jest.mock('electron', () => ({
  app: {
    getPath: jest.fn()
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

  it('get login state returns new user by default', async () => {
    const result = await handleRequest({ type: DBRequestType.GET_LOGIN_STATE });
    // @todo Test other cases
    expect(result).toBe(LoginState.NEW_USER);
  });

  it('get accounts', async () => {
    const result = await handleRequest({ type: DBRequestType.GET_ACCOUNTS });
    // @todo
    expect(result).toStrictEqual([]);
  });
});

import { app, ipcMain } from 'electron';
import Store from 'electron-store';
import fs from 'fs';
import path from 'path';

import { IPC_CHANNELS } from '@config';
import { DBRequest, DBRequestType } from '@types';
import { LoginState } from '@types/db';

let store: Store;

const login = (password: string) => {
  try {
    store = new Store({ encryptionKey: password, clearInvalidConfig: false });
  } catch (err) {
    console.error(err);
    return false;
  }
  return true;
};

const isNewUser = async () => {
  const configPath = path.join(app.getPath('userData'), 'config.json');
  // Is new user if config file doesn't exist
  return !!(await fs.promises.stat(configPath).catch(() => false));
};

const isLoggedIn = () => store !== undefined;

const getLoginState = () => {
  if (isNewUser) {
    return LoginState.NEW_USER;
  } else if (isLoggedIn()) {
    return LoginState.LOGGED_IN;
  }
  return LoginState.LOGGED_OUT;
};

const getAccounts = () => {
  return store.get('accounts');
};

export const runService = () => {
  ipcMain.handle(IPC_CHANNELS.DATABASE, (_e, request: DBRequest) => {
    switch (request.type) {
      case DBRequestType.LOGIN:
        return login(request.password);
      case DBRequestType.GET_LOGIN_STATE:
        return getLoginState();
      case DBRequestType.GET_ACCOUNTS:
        return getAccounts();
      default:
        throw new Error('Undefined request type');
    }
  });
};

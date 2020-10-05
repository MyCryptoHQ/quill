import { ipcMain } from 'electron';
import Store from 'electron-store';

import { IPC_CHANNELS } from '@config';
import { DBRequest, DBRequestType } from '@types';

let store: Store;

const login = (password: string) => {
  try {
    store = new Store({ encryptionKey: password });
  } catch (err) {
    return false;
  }
  return true;
};

const getAccounts = () => {
  return store.get('accounts');
};

export const runService = () => {
  ipcMain.handle(IPC_CHANNELS.DATABASE, (_e, request: DBRequest) => {
    switch (request.type) {
      case DBRequestType.LOGIN:
        return login(request.password);
      case DBRequestType.GET_ACCOUNTS:
        return getAccounts();
      default:
        throw new Error('Undefined request type');
    }
  });
};

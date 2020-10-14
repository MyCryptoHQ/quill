import { app, ipcMain } from 'electron';
import Store from 'electron-store';
import fs from 'fs';
import keytar from 'keytar';
import path from 'path';

import { AccountsState } from '@app/store/account';
import { IPC_CHANNELS, KEYTAR_SERVICE } from '@config';
import { DBRequest, DBRequestType, DBResponse, TUuid } from '@types';
import { safeJSONParse } from '@utils';
import { decrypt, encrypt, hashPassword } from '@utils/encryption';

const store = new Store();

// @todo STORES HASHED PASSWORD FOR ENCRYPTION - THINK ABOUT THIS
let encryptionKey: string;

const setEncryptionKey = async (key: string) => (encryptionKey = await hashPassword(key));

export const init = async (password: string) => {
  try {
    await setEncryptionKey(password);
    // Clear in case the store already contains data
    store.clear();
    // Write something to the store to actually create the file
    setInStore('accounts', {});
  } catch (err) {
    console.error(err);
    return false;
  }
  return true;
};

const login = async (password: string) => {
  if (!(await checkPassword(password))) {
    return false;
  }
  try {
    await setEncryptionKey(password);
  } catch (err) {
    console.error(err);
    return false;
  }
  return true;
};

const storeExists = async () => {
  const configPath = path.join(app.getPath('userData'), 'config.json');
  // Is new user if config file doesn't exist
  return !!(await fs.promises.stat(configPath).catch(() => false));
};

const isLoggedIn = () => checkPassword(encryptionKey);

const checkPassword = async (password?: string) => {
  if (!password || password.length === 0) {
    return false;
  }
  return getFromStore('accounts', await hashPassword(password)) !== null;
};

const getFromStore = <T>(key: string, password = encryptionKey): T | null => {
  const result = store.get(key) as string;
  const decrypted = decrypt(result, password);
  const [valid, parsed] = safeJSONParse(decrypted);
  return valid !== null ? parsed : null;
};

const setInStore = <T>(key: string, obj: T) => {
  const json = JSON.stringify(obj);
  const encrypted = encrypt(json, encryptionKey);
  store.set(key, encrypted);
};

export const getAccounts = () => {
  return getFromStore<AccountsState>('accounts');
};

const setAccounts = (accounts: AccountsState) => {
  return setInStore('accounts', accounts);
};

const savePrivateKey = (uuid: TUuid, privateKey: string) => {
  const encryptedPKey = encrypt(privateKey, encryptionKey);
  return keytar.setPassword(KEYTAR_SERVICE, uuid, encryptedPKey);
};

const getPrivateKey = async (uuid: TUuid) => {
  const result = await keytar.getPassword(KEYTAR_SERVICE, uuid);
  if (result) {
    return decrypt(result, encryptionKey);
  }
  return null;
};

const deletePrivateKey = async (uuid: TUuid) => {
  return keytar.deletePassword(KEYTAR_SERVICE, uuid);
};

export const handleRequest = async (request: DBRequest): Promise<DBResponse> => {
  switch (request.type) {
    case DBRequestType.INIT:
      return Promise.resolve(init(request.password));
    case DBRequestType.LOGIN:
      return Promise.resolve(login(request.password));
    case DBRequestType.IS_LOGGED_IN:
      return Promise.resolve(isLoggedIn());
    case DBRequestType.IS_NEW_USER:
      return !(await storeExists());
    case DBRequestType.GET_ACCOUNTS:
      return Promise.resolve(getAccounts());
    case DBRequestType.SET_ACCOUNTS:
      return Promise.resolve(setAccounts(request.accounts));
    case DBRequestType.SAVE_PRIVATE_KEY:
      return savePrivateKey(request.uuid, request.privateKey);
    case DBRequestType.GET_PRIVATE_KEY:
      return getPrivateKey(request.uuid);
    case DBRequestType.DELETE_PRIVATE_KEY:
      return deletePrivateKey(request.uuid);
    default:
      throw new Error('Undefined request type');
  }
};

export const runService = () => {
  ipcMain.handle(IPC_CHANNELS.DATABASE, (_e, request: DBRequest) => handleRequest(request));
};

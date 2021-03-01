import { getWallet } from '@wallets/wallet-initialisation';
import { app, ipcMain } from 'electron';
import Store from 'electron-store';
import fs from 'fs';
import keytar from 'keytar';
import path from 'path';

import { IPC_CHANNELS, KEYTAR_SERVICE } from '@config';
import { DBRequest, DBRequestType, DBResponse, SerializedWallet, TUuid } from '@types';
import { generateDeterministicAddressUUID, safeJSONParse } from '@utils';
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
  try {
    const hashedPassword = await hashPassword(password);
    if (!checkPassword(hashedPassword)) {
      return false;
    }
    await setEncryptionKey(password);
  } catch (err) {
    console.error(err);
    return false;
  }
  return true;
};

const reset = () => {
  encryptionKey = undefined;
  store.clear();
  return fs.promises.unlink(getStorePath());
};

const getStorePath = () => path.join(app.getPath('userData'), 'config.json');

const storeExists = async () => {
  const configPath = getStorePath();
  // Is new user if config file doesn't exist
  return !!(await fs.promises.stat(configPath).catch(() => false));
};

const isLoggedIn = () => checkPassword(encryptionKey);

const checkPassword = (hashedPassword?: string) => {
  if (!hashedPassword || hashedPassword.length === 0) {
    return false;
  }
  return getFromStore('accounts', hashedPassword) !== null;
};

// @todo Improve typing?
export const getFromStore = <T>(key: string, password = encryptionKey): T | null => {
  const result = store.get(key) as string;
  const decrypted = decrypt(result, password);
  const [valid, parsed] = safeJSONParse<T>(decrypted);
  return valid === null ? parsed : null;
};

export const setInStore = <T>(key: string, obj: T) => {
  const json = JSON.stringify(obj);
  const encrypted = encrypt(json, encryptionKey);
  store.set(key, encrypted);
};

const savePrivateKey = (uuid: TUuid, privateKey: string) => {
  const encryptedPKey = encrypt(privateKey, encryptionKey);
  return keytar.setPassword(KEYTAR_SERVICE, uuid, encryptedPKey);
};

export const getPrivateKey = async (uuid: TUuid) => {
  const result = await keytar.getPassword(KEYTAR_SERVICE, uuid);
  if (result) {
    return decrypt(result, encryptionKey);
  }
  return null;
};

const deleteAccountSecrets = async (uuid: TUuid) => {
  return keytar.deletePassword(KEYTAR_SERVICE, uuid);
};

const saveAccountSecrets = async (initialiseWallet: SerializedWallet) => {
  const wallet = await getWallet(initialiseWallet);
  const privateKey = await wallet.getPrivateKey();
  const uuid = generateDeterministicAddressUUID(await wallet.getAddress());

  return savePrivateKey(uuid, privateKey);
};

export const handleRequest = async (request: DBRequest): Promise<DBResponse> => {
  switch (request.type) {
    case DBRequestType.INIT:
      return Promise.resolve(init(request.password));
    case DBRequestType.LOGIN:
      return Promise.resolve(login(request.password));
    case DBRequestType.RESET:
      return reset();
    case DBRequestType.IS_LOGGED_IN:
      return Promise.resolve(isLoggedIn());
    case DBRequestType.IS_NEW_USER:
      return !(await storeExists());
    case DBRequestType.GET_FROM_STORE:
      return Promise.resolve(getFromStore(request.key));
    case DBRequestType.SET_IN_STORE:
      return Promise.resolve(setInStore(request.key, request.payload));
    case DBRequestType.SAVE_ACCOUNT_SECRETS:
      return saveAccountSecrets(request.wallet);
    case DBRequestType.GET_PRIVATE_KEY:
      return getPrivateKey(request.uuid);
    case DBRequestType.DELETE_ACCOUNT_SECRETS:
      return deleteAccountSecrets(request.uuid);
    default:
      throw new Error('Undefined request type');
  }
};

export const runService = () => {
  ipcMain.handle(IPC_CHANNELS.DATABASE, (_e, request: DBRequest) => handleRequest(request));
};

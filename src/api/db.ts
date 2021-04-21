import { getWallet } from '@wallets/wallet-initialisation';
import { app } from 'electron';
import Store from 'electron-store';
import { promises as fs } from 'fs';
import keytar from 'keytar';
import path from 'path';

import { KEYTAR_SERVICE } from '@config';
import type { SerializedWallet, TUuid } from '@types';
import { generateDeterministicAddressUUID, safeJSONParse } from '@utils';
import { decrypt, encrypt, hashPassword } from '@utils/encryption';

const store = new Store();

// @todo STORES HASHED PASSWORD FOR ENCRYPTION - THINK ABOUT THIS
const encryptionKey = Buffer.alloc(32);

const setEncryptionKey = async (key: Buffer) => {
  key.copy(encryptionKey);
  key.fill(0);
};

const clearEncryptionKey = () => encryptionKey.fill(0);

export const init = async (password: string) => {
  try {
    const hashedPassword = await hashPassword(password);
    await setEncryptionKey(hashedPassword);
    // Clear in case the store already contains data
    store.clear();
    // Write something to the store to actually create the file
    setInStore('accounts', {}, false);
  } catch (err) {
    return false;
  }

  return true;
};

export const login = async (password: string) => {
  try {
    const hashedPassword = await hashPassword(password);
    if (!checkPassword(hashedPassword)) {
      hashedPassword.fill(0);
      return false;
    }

    await setEncryptionKey(hashedPassword);
  } catch {
    return false;
  }

  return true;
};

export const logout = async () => {
  clearEncryptionKey();
};

export const reset = async () => {
  clearEncryptionKey();
  store.clear();

  const credentials = await keytar.findCredentials(KEYTAR_SERVICE);
  for (const { account } of credentials) {
    await keytar.deletePassword(KEYTAR_SERVICE, account);
  }

  return fs.unlink(getStorePath());
};

const getStorePath = () => path.join(app.getPath('userData'), 'config.json');

export const storeExists = async () => {
  const configPath = getStorePath();
  // Is new user if config file doesn't exist
  return !!(await fs.stat(configPath).catch(() => false));
};

export const isLoggedIn = () => checkPassword(encryptionKey);

const checkPassword = (hashedPassword: Buffer) => {
  if (hashedPassword.compare(Buffer.alloc(32)) === 0) {
    return false;
  }

  try {
    return getFromStore('accounts', hashedPassword) !== null;
  } catch {
    return false;
  }
};

// @todo Improve typing?
export const getFromStore = <T>(key: string, password = encryptionKey): T | null => {
  const result = store.get(key) as string;
  if (!result) {
    return null;
  }

  const decrypted = decrypt(result, password);
  const [valid, parsed] = safeJSONParse<T>(decrypted);
  return valid === null ? parsed : null;
};

export const setInStore = <T>(key: string, obj: T, checkLogin = true) => {
  if (checkLogin && !isLoggedIn()) {
    return;
  }

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

export const deleteAccountSecrets = async (uuid: TUuid) => {
  return keytar.deletePassword(KEYTAR_SERVICE, uuid);
};

export const saveAccountSecrets = async (initialiseWallet: SerializedWallet) => {
  const wallet = await getWallet(initialiseWallet);
  const privateKey = await wallet.getPrivateKey();
  const uuid = generateDeterministicAddressUUID(await wallet.getAddress());

  return savePrivateKey(uuid, privateKey);
};

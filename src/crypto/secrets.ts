import { getWallet } from '@wallets/wallet-initialisation';
import keytar from 'keytar';

import { KEYTAR_SERVICE, KEYTAR_SETTINGS_KEY_NAME } from '@config';
import type { SerializedWallet, TUuid } from '@types';
import { generateDeterministicAddressUUID } from '@utils';
import { createEncryptionKey, decrypt, encrypt, hashPassword } from '@utils/encryption';

// @todo STORES HASHED PASSWORD FOR ENCRYPTION - THINK ABOUT THIS
const encryptionKey = Buffer.alloc(32);

const setEncryptionKey = async (key: Buffer) => {
  key.copy(encryptionKey);
  key.fill(0);
};

export const clearEncryptionKey = () => {
  encryptionKey.fill(0);
};

export const init = async (password: string) => {
  const key = await hashPassword(password);
  await setEncryptionKey(key);
};

const savePrivateKey = (uuid: TUuid | typeof KEYTAR_SETTINGS_KEY_NAME, privateKey: string) => {
  const encryptedPKey = encrypt(privateKey, encryptionKey);
  return keytar.setPassword(KEYTAR_SERVICE, uuid, encryptedPKey);
};

export const getPrivateKey = async (uuid: TUuid | typeof KEYTAR_SETTINGS_KEY_NAME) => {
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

/**
 * Gets and decrypts the settings key if it exists. Otherwise, a new settings key is generated and
 * stored in the keychain.
 *
 * This assumes that the global `encryptionKey` is set.
 */
export const getSettingsKey = async (): Promise<Buffer> => {
  const settingsKey = await getPrivateKey(KEYTAR_SETTINGS_KEY_NAME);
  if (settingsKey) {
    return Buffer.from(settingsKey, 'hex');
  }

  const newKey = createEncryptionKey();
  await savePrivateKey(KEYTAR_SETTINGS_KEY_NAME, newKey.toString('hex'));

  return newKey;
};

export const hasSettingsKey = async (): Promise<boolean> => {
  const key = await keytar.getPassword(KEYTAR_SERVICE, KEYTAR_SETTINGS_KEY_NAME);
  return !!key;
};

export const checkSettingsKey = async (): Promise<boolean> => {
  try {
    await getSettingsKey();
    return true;
  } catch {
    return false;
  }
};

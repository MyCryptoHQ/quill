import { generateDeterministicAddressUUID } from '@quill/common';
import type { SerializedWallet, TUuid } from '@quill/common';
import { getWallet } from '@wallets/wallet-initialisation';
import keytar from 'keytar';

import { KEYTAR_SALT_NAME, KEYTAR_SERVICE, KEYTAR_SETTINGS_KEY_NAME } from '@config';
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
  const salt = await getSalt();
  const key = await hashPassword(password, salt);
  await setEncryptionKey(key);
};

export const savePrivateKey = (
  uuid: TUuid | typeof KEYTAR_SETTINGS_KEY_NAME,
  privateKey: string
) => {
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

/**
 * A safe version of the function above, which does not throw an error if the private key cannot be
 * decrypted.
 */
export const safeGetPrivateKey = async (uuid: TUuid | typeof KEYTAR_SETTINGS_KEY_NAME) => {
  try {
    return await getPrivateKey(uuid);
  } catch {
    return null;
  }
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
 *
 * @param generateKey If set to true, a new key will be generated if there is no key yet. If set to
 *   false and there is no key yet, this function will throw an error.
 */
export const getSettingsKey = async (generateKey: boolean = true): Promise<Buffer> => {
  const settingsKey = await getPrivateKey(KEYTAR_SETTINGS_KEY_NAME);
  if (settingsKey) {
    return Buffer.from(settingsKey, 'hex');
  }

  if (generateKey) {
    const newKey = createEncryptionKey();
    await savePrivateKey(KEYTAR_SETTINGS_KEY_NAME, newKey.toString('hex'));

    return newKey;
  }

  throw new Error('Settings key does not exist');
};

export const hasSettingsKey = async (): Promise<boolean> => {
  const key = await keytar.getPassword(KEYTAR_SERVICE, KEYTAR_SETTINGS_KEY_NAME);
  return !!key;
};

export const checkSettingsKey = async (): Promise<boolean> => {
  try {
    await getSettingsKey(false);
    return true;
  } catch {
    return false;
  }
};

export const getSalt = async (): Promise<Buffer> => {
  const salt = await keytar.getPassword(KEYTAR_SERVICE, KEYTAR_SALT_NAME);
  if (salt) {
    return Buffer.from(salt, 'hex');
  }

  const newSalt = createEncryptionKey();
  await keytar.setPassword(KEYTAR_SERVICE, KEYTAR_SALT_NAME, newSalt.toString('hex'));

  return newSalt;
};

export const deleteSalt = () => keytar.deletePassword(KEYTAR_SERVICE, KEYTAR_SALT_NAME);

/**
 * Checks if `password` is equal to the current used password.
 *
 * @param password The password to check.
 */
export const comparePassword = async (password: string) => {
  const salt = await getSalt();
  const key = await hashPassword(password, salt);

  return encryptionKey.compare(key) === 0;
};

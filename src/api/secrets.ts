import { ipcMain } from 'electron';
import keytar from 'keytar';

import { IPC_CHANNELS, KEYTAR_SERVICE } from '@config';
import { SecretsRequest, SecretsRequestType, SecretsResponse, TUuid } from '@types';
import { decrypt, encrypt, hashPassword } from '@utils/encryption';

// @todo STORES HASHED PASSWORD FOR ENCRYPTION - THINK ABOUT THIS
let encryptionKey: string;

const setEncryptionKey = (key: string) => (encryptionKey = hashPassword(key));

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

export const handleRequest = async (request: SecretsRequest): Promise<SecretsResponse> => {
  switch (request.type) {
    case SecretsRequestType.SET_ENCRYPTION_KEY:
      return setEncryptionKey(request.encryptionKey);
    case SecretsRequestType.SAVE_PRIVATE_KEY:
      return savePrivateKey(request.uuid, request.privateKey);
    case SecretsRequestType.GET_PRIVATE_KEY:
      return getPrivateKey(request.uuid);
    case SecretsRequestType.DELETE_PRIVATE_KEY:
      return deletePrivateKey(request.uuid);
    default:
      throw new Error('Undefined request type');
  }
};

export const runService = () => {
  ipcMain.handle(IPC_CHANNELS.SECRETS, (_e, request: SecretsRequest) => handleRequest(request));
};

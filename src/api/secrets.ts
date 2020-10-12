import { ipcMain } from 'electron';
import keytar from 'keytar';

import { IPC_CHANNELS, KEYTAR_SERVICE } from '@config';
import { SecretsRequest, SecretsRequestType, SecretsResponse, TUuid } from '@types';
import { decrypt, encrypt, hashPassword } from '@utils/encryption';

const SavePrivateKey = (uuid: TUuid, password: string, privateKey: string) => {
  const hashedPassword = hashPassword(password);
  const encryptedPKey = encrypt(privateKey, hashedPassword);
  return keytar.setPassword(KEYTAR_SERVICE, uuid, encryptedPKey);
};

const GetPrivateKey = async (uuid: TUuid, password: string) => {
  const result = await keytar.getPassword(KEYTAR_SERVICE, uuid);
  if (result) {
    const hashedPassword = hashPassword(password);
    return decrypt(result, hashedPassword);
  }
  return null;
};

const DeletePrivateKey = async (uuid: TUuid) => {
  return keytar.deletePassword(KEYTAR_SERVICE, uuid);
};

export const handleRequest = async (request: SecretsRequest): Promise<SecretsResponse> => {
  switch (request.type) {
    case SecretsRequestType.SAVE_PRIVATE_KEY:
      return SavePrivateKey(request.uuid, request.password, request.privateKey);
    case SecretsRequestType.GET_PRIVATE_KEY:
      return GetPrivateKey(request.uuid, request.password);
    case SecretsRequestType.DELETE_PRIVATE_KEY:
      return DeletePrivateKey(request.uuid);
    default:
      throw new Error('Undefined request type');
  }
};

export const runService = () => {
  ipcMain.handle(IPC_CHANNELS.SECRETS, (_e, request: SecretsRequest) => handleRequest(request));
};

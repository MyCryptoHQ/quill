import { ipcBridgeRenderer } from '@bridge';
import { SecretsRequestType, TUuid } from '@types';

export const setEncryptionKey = (encryptionKey: string): Promise<void> => {
  return ipcBridgeRenderer.secrets.invoke({
    type: SecretsRequestType.SET_ENCRYPTION_KEY,
    encryptionKey
  });
};

export const savePrivateKey = (uuid: TUuid, privateKey: string): Promise<void> => {
  return ipcBridgeRenderer.secrets.invoke({
    type: SecretsRequestType.SAVE_PRIVATE_KEY,
    uuid,
    privateKey
  });
};

export const getPrivateKey = (uuid: TUuid): Promise<string | null> => {
  return ipcBridgeRenderer.secrets.invoke({
    type: SecretsRequestType.GET_PRIVATE_KEY,
    uuid
  });
};

export const deletePrivateKey = (uuid: TUuid): Promise<boolean> => {
  return ipcBridgeRenderer.secrets.invoke({
    type: SecretsRequestType.DELETE_PRIVATE_KEY,
    uuid
  });
};

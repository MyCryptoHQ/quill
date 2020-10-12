import { ipcBridgeRenderer } from '@bridge';
import { SecretsRequestType, TUuid } from '@types';

export const savePrivateKey = (uuid: TUuid, password: string, privateKey: string) => {
  return ipcBridgeRenderer.secrets.invoke({
    type: SecretsRequestType.SAVE_PRIVATE_KEY,
    uuid,
    password,
    privateKey
  });
};

export const getPrivateKey = (uuid: TUuid, password: string) => {
  return ipcBridgeRenderer.secrets.invoke({
    type: SecretsRequestType.GET_PRIVATE_KEY,
    uuid,
    password
  });
};

export const deletePrivateKey = (uuid: TUuid) => {
  return ipcBridgeRenderer.secrets.invoke({
    type: SecretsRequestType.DELETE_PRIVATE_KEY,
    uuid
  });
};

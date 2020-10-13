import { ipcBridgeRenderer } from '@bridge';
import { SecretsRequestType, TUuid } from '@types';

import {
  deletePrivateKey,
  getPrivateKey,
  savePrivateKey,
  setEncryptionKey
} from './SecretsService';

jest.mock('@bridge', () => ({
  ipcBridgeRenderer: {
    secrets: {
      invoke: jest.fn()
    }
  }
}));

const uuid = 'a259a13e-936b-5945-8c80-7f757e808507' as TUuid;
const encryptionKey = 'password';
const privateKey = 'privkey';

describe('SecretsService', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('calls ipcBridge with setEncryptionKey', () => {
    setEncryptionKey(encryptionKey);
    expect(ipcBridgeRenderer.secrets.invoke).toHaveBeenCalledWith({
      type: SecretsRequestType.SET_ENCRYPTION_KEY,
      encryptionKey
    });
  });

  it('calls ipcBridge with savePrivateKey', () => {
    savePrivateKey(uuid, privateKey);
    expect(ipcBridgeRenderer.secrets.invoke).toHaveBeenCalledWith({
      type: SecretsRequestType.SAVE_PRIVATE_KEY,
      privateKey,
      uuid
    });
  });

  it('calls ipcBridge with getPrivateKey', () => {
    getPrivateKey(uuid);
    expect(ipcBridgeRenderer.secrets.invoke).toHaveBeenCalledWith({
      type: SecretsRequestType.GET_PRIVATE_KEY,
      uuid
    });
  });

  it('calls ipcBridge with deletePrivateKey', () => {
    deletePrivateKey(uuid);
    expect(ipcBridgeRenderer.secrets.invoke).toHaveBeenCalledWith({
      type: SecretsRequestType.DELETE_PRIVATE_KEY,
      uuid
    });
  });
});

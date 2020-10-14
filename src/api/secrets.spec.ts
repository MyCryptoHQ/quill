import { ipcMain } from 'electron';
import keytar from 'keytar';

import { IPC_CHANNELS, KEYTAR_SERVICE } from '@config';
import { SecretsRequestType, TUuid } from '@types';

import { handleRequest, runService } from './secrets';

jest.mock('electron', () => ({
  ipcMain: {
    handle: jest.fn()
  }
}));

jest.mock('keytar', () => ({
  setPassword: jest.fn(),
  getPassword: jest.fn().mockImplementation(() => 'd28327f4f5af82'),
  deletePassword: jest.fn()
}));

const uuid = 'a259a13e-936b-5945-8c80-7f757e808507' as TUuid;
const encryptionKey = 'password';
const privateKey = 'privkey';
const encryptedPrivKey = 'd28327f4f5af82';

describe('handleRequest', () => {
  it('SAVE_PRIVATE_KEY calls setPassword with encrypted privkey', async () => {
    await handleRequest({
      type: SecretsRequestType.SET_ENCRYPTION_KEY,
      encryptionKey
    });

    await handleRequest({
      type: SecretsRequestType.SAVE_PRIVATE_KEY,
      uuid,
      privateKey
    });

    expect(keytar.setPassword).toHaveBeenCalledWith(KEYTAR_SERVICE, uuid, encryptedPrivKey);
  });

  it('GET_PRIVATE_KEY returns decrypted private key', async () => {
    await handleRequest({
      type: SecretsRequestType.SET_ENCRYPTION_KEY,
      encryptionKey
    });

    const response = await handleRequest({
      type: SecretsRequestType.GET_PRIVATE_KEY,
      uuid
    });

    expect(keytar.getPassword).toHaveBeenCalledWith(KEYTAR_SERVICE, uuid);
    expect(response).toBe(privateKey);
  });

  it('DELETE_PRIVATE_KEY returns decrypted private key', async () => {
    await handleRequest({
      type: SecretsRequestType.DELETE_PRIVATE_KEY,
      uuid
    });

    expect(keytar.deletePassword).toHaveBeenCalledWith(KEYTAR_SERVICE, uuid);
  });
});

describe('runService', () => {
  it('calls ipcMain handle', () => {
    runService();
    expect(ipcMain.handle).toHaveBeenCalledWith(IPC_CHANNELS.SECRETS, expect.any(Function));
  });
});

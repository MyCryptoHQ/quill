import keytar from 'keytar';

import { KEYTAR_SERVICE, KEYTAR_SETTINGS_KEY_NAME } from '@config';
import type { TUuid } from '@types';
import { WalletType } from '@types';

import {
  checkSettingsKey,
  deleteAccountSecrets,
  getPrivateKey,
  getSettingsKey,
  hasSettingsKey,
  init,
  saveAccountSecrets
} from './secrets';

jest.mock('crypto', () => ({
  ...jest.requireActual('crypto'),
  randomBytes: jest.fn().mockImplementation(() => Buffer.from('2d21938ada7a165c39c8f3fd', 'hex'))
}));

jest.mock('keytar', () => ({
  setPassword: jest.fn(),
  getPassword: jest
    .fn()
    .mockImplementation(
      () =>
        '6860de1fab1e5e03c3880b92874195800906ec77f007484c19878abdb9e3a65af3bb65b2d72a0e997d04cea288882a4fc072ee0bd76f2f19bb1d09ad88c3f671def50b2987872f229241677f5f3a8d93a0682d21938ada7a165c39c8f3fd'
    ),
  deletePassword: jest.fn(),
  findCredentials: jest.fn().mockReturnValue([{ account: 'foo' }])
}));

const uuid = '304a57a4-1752-53db-8861-67785534e98e' as TUuid;
const password = 'password';
const privateKey = '0x93b3701cf8eeb6f7d3b22211c691734f24816a02efa933f67f34d37053182577';
const encryptedPrivKey =
  '6860de1fab1e5e03c3880b92874195800906ec77f007484c19878abdb9e3a65af3bb65b2d72a0e997d04cea288882a4fc072ee0bd76f2f19bb1d09ad88c3f671def50b2987872f229241677f5f3a8d93a0682d21938ada7a165c39c8f3fd';

describe('saveAccountSecrets', () => {
  it('calls setPassword with encrypted privkey', async () => {
    await init(password);
    await saveAccountSecrets({
      walletType: WalletType.PRIVATE_KEY,
      privateKey
    });

    expect(keytar.setPassword).toHaveBeenCalledWith(KEYTAR_SERVICE, uuid, encryptedPrivKey);
  });
});

describe('getPrivateKey', () => {
  it('returns decrypted private key', async () => {
    await init(password);
    const response = await getPrivateKey(uuid);

    expect(keytar.getPassword).toHaveBeenCalledWith(KEYTAR_SERVICE, uuid);
    expect(response).toBe(privateKey);
  });

  it('returns null if keytar returns null', async () => {
    (keytar.getPassword as jest.MockedFunction<typeof keytar.getPassword>).mockImplementationOnce(
      () => null
    );

    return expect(getPrivateKey(uuid)).resolves.toBeNull();
  });
});

describe('deleteAccountSecrets', () => {
  it('calls deletePassword', async () => {
    await deleteAccountSecrets(uuid);

    expect(keytar.deletePassword).toHaveBeenCalledWith(KEYTAR_SERVICE, uuid);
  });
});

describe('getSettingsKey', () => {
  it('generates a settings key if it does not exist', async () => {
    (keytar.getPassword as jest.MockedFunction<typeof keytar.getPassword>).mockImplementationOnce(
      async () => undefined
    );

    await init(password);
    await expect(getSettingsKey()).resolves.toStrictEqual(
      Buffer.from('2d21938ada7a165c39c8f3fd', 'hex')
    );
    await expect(keytar.setPassword).toHaveBeenCalledWith(
      KEYTAR_SERVICE,
      KEYTAR_SETTINGS_KEY_NAME,
      '6a7cd51df01e5152968a5acbd312c2d55c08eb7cf4061c1a4d1de326ebcbbea026d35cd7b5c43ade2d21938ada7a165c39c8f3fd'
    );
  });

  it('gets and decrypts the settings key from the keychain', async () => {
    (keytar.getPassword as jest.MockedFunction<typeof keytar.getPassword>).mockImplementationOnce(
      async () =>
        '6a7cd51df01e5152968a5acbd312c2d55c08eb7cf4061c1a4d1de326ebcbbea026d35cd7b5c43ade2d21938ada7a165c39c8f3fd'
    );

    await init(password);
    await expect(getSettingsKey()).resolves.toStrictEqual(
      Buffer.from('2d21938ada7a165c39c8f3fd', 'hex')
    );
  });

  it('throws an error if the settings key cannot be decrypted', async () => {
    (keytar.getPassword as jest.MockedFunction<typeof keytar.getPassword>).mockImplementationOnce(
      async () => 'foo'
    );

    await init(password);
    await expect(getSettingsKey()).rejects.toThrow();
  });
});

describe('hasSettingsKey', () => {
  it('checks if the settings key is set', async () => {
    (keytar.getPassword as jest.MockedFunction<typeof keytar.getPassword>)
      .mockImplementationOnce(async () => 'foo')
      .mockImplementationOnce(async () => undefined);

    await expect(hasSettingsKey()).resolves.toBe(true);
    await expect(hasSettingsKey()).resolves.toBe(false);
  });
});

describe('checkSettingsKey', () => {
  it('checks if the settings key can be decrypted', async () => {
    (keytar.getPassword as jest.MockedFunction<typeof keytar.getPassword>).mockImplementation(
      async () =>
        '6a7cd51df01e5152968a5acbd312c2d55c08eb7cf4061c1a4d1de326ebcbbea026d35cd7b5c43ade2d21938ada7a165c39c8f3fd'
    );

    await init(password);
    await expect(checkSettingsKey()).resolves.toBe(true);
  });

  it('returns false if the key cannot be decrypted', async () => {
    (keytar.getPassword as jest.MockedFunction<typeof keytar.getPassword>).mockImplementation(
      async () => 'foo'
    );

    await init(password);
    await expect(checkSettingsKey()).resolves.toBe(false);
  });
});

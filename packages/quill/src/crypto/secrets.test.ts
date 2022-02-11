import type { TUuid } from '@quill/common';
import { WalletType } from '@quill/common';
import keytar from 'keytar';

import { KEYTAR_SALT_NAME, KEYTAR_SERVICE, KEYTAR_SETTINGS_KEY_NAME } from '@config';

import {
  checkSettingsKey,
  comparePassword,
  deleteAccountSecrets,
  deleteSalt,
  getPrivateKey,
  getSalt,
  getSettingsKey,
  hasSettingsKey,
  init,
  safeGetPrivateKey,
  saveAccountSecrets
} from './secrets';

jest.mock('crypto', () => ({
  ...jest.requireActual('crypto'),
  randomBytes: jest.fn().mockImplementation(() => Buffer.from('2d21938ada7a165c39c8f3fd', 'hex'))
}));

jest.mock('keytar', () => ({
  setPassword: jest.fn(),
  getPassword: jest.fn().mockImplementation((_, name) => {
    if (name === 'Salt') {
      // KEYTAR_SALT_NAME
      return 'dc509bcfc343f1bebb4d75749695fd3ef204306f07eff6f86eec91587ba03bbc';
    }

    return '77da3aadfd0d4907fc208f9b970ab7d59d03fa2e3e0cbbace37798b46ec9c8638e175a60c0421c01f3706e6e8e3d1836737311d90450ceaf7f3a7bf32c77b39e769b46929aab77f2982b39aaa9d433876c2e2d21938ada7a165c39c8f3fd';
  }),
  deletePassword: jest.fn(),
  findCredentials: jest.fn().mockReturnValue([{ account: 'foo' }])
}));

const uuid = '304a57a4-1752-53db-8861-67785534e98e' as TUuid;
const password = 'password';
const salt = 'dc509bcfc343f1bebb4d75749695fd3ef204306f07eff6f86eec91587ba03bbc';
const privateKey = '0x93b3701cf8eeb6f7d3b22211c691734f24816a02efa933f67f34d37053182577';
const encryptedPrivKey =
  '77da3aadfd0d4907fc208f9b970ab7d59d03fa2e3e0cbbace37798b46ec9c8638e175a60c0421c01f3706e6e8e3d1836737311d90450ceaf7f3a7bf32c77b39e769b46929aab77f2982b39aaa9d433876c2e2d21938ada7a165c39c8f3fd';

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

describe('safeGetPrivateKey', () => {
  it('returns decrypted private key', async () => {
    await init(password);
    const response = await safeGetPrivateKey(uuid);

    expect(keytar.getPassword).toHaveBeenCalledWith(KEYTAR_SERVICE, uuid);
    expect(response).toBe(privateKey);
  });

  it('does not throw on errors', async () => {
    (keytar.getPassword as jest.MockedFunction<typeof keytar.getPassword>).mockImplementationOnce(
      async () => 'foo'
    );

    await init(password);
    await expect(safeGetPrivateKey(uuid)).resolves.toBeNull();
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
    (keytar.getPassword as jest.MockedFunction<typeof keytar.getPassword>)
      .mockImplementationOnce(async () => salt)
      .mockImplementationOnce(async () => undefined);

    await init(password);
    await expect(getSettingsKey()).resolves.toStrictEqual(
      Buffer.from('2d21938ada7a165c39c8f3fd', 'hex')
    );
    await expect(keytar.setPassword).toHaveBeenCalledWith(
      KEYTAR_SERVICE,
      KEYTAR_SETTINGS_KEY_NAME,
      '75c631afa60d4656a922dec2c359e080c80dfd253a0deffadeba90098bd6e2e55ca1c61787e3291d2d21938ada7a165c39c8f3fd'
    );
  });

  it('gets and decrypts the settings key from the keychain', async () => {
    (keytar.getPassword as jest.MockedFunction<typeof keytar.getPassword>)
      .mockImplementationOnce(async () => salt)
      .mockImplementationOnce(
        async () =>
          '75c631afa60d4656a922dec2c359e080c80dfd253a0deffadeba90098bd6e2e55ca1c61787e3291d2d21938ada7a165c39c8f3fd'
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
    (keytar.getPassword as jest.MockedFunction<typeof keytar.getPassword>)
      .mockImplementationOnce(async () => salt)
      .mockImplementationOnce(
        async () =>
          '75c631afa60d4656a922dec2c359e080c80dfd253a0deffadeba90098bd6e2e55ca1c61787e3291d2d21938ada7a165c39c8f3fd'
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

describe('getSalt', () => {
  it('generates a salt if it does not exist', async () => {
    (keytar.getPassword as jest.MockedFunction<typeof keytar.getPassword>).mockImplementationOnce(
      async () => undefined
    );

    await expect(getSalt()).resolves.toStrictEqual(Buffer.from('2d21938ada7a165c39c8f3fd', 'hex'));
    await expect(keytar.setPassword).toHaveBeenCalledWith(
      KEYTAR_SERVICE,
      KEYTAR_SALT_NAME,
      '2d21938ada7a165c39c8f3fd'
    );
  });

  it('gets the salt from the keychain', async () => {
    (keytar.getPassword as jest.MockedFunction<typeof keytar.getPassword>).mockImplementationOnce(
      async () => salt
    );

    await expect(getSalt()).resolves.toStrictEqual(Buffer.from(salt, 'hex'));
  });
});

describe('deleteSalt', () => {
  it('deletes the salt', async () => {
    await deleteSalt();
    expect(keytar.deletePassword).toHaveBeenCalledWith(KEYTAR_SERVICE, KEYTAR_SALT_NAME);
  });
});

describe('comparePassword', () => {
  it('compares a password with the current used password', async () => {
    await init('foo');
    await expect(comparePassword('foo')).resolves.toBe(true);
    await expect(comparePassword('bar')).resolves.toBe(false);
  });
});

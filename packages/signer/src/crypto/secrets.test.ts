import type { TUuid } from '@signer/common';
import { WalletType } from '@signer/common';
import keytar from 'keytar';

import { KEYTAR_SALT_NAME, KEYTAR_SERVICE, KEYTAR_SETTINGS_KEY_NAME } from '@config';

import {
  checkSettingsKey,
  deleteAccountSecrets,
  getPrivateKey,
  getSalt,
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
  getPassword: jest.fn().mockImplementation((_, name) => {
    if (name === 'Salt') {
      // KEYTAR_SALT_NAME
      return 'dc509bcfc343f1bebb4d75749695fd3ef204306f07eff6f86eec91587ba03bbc';
    }

    return '834a035a579c76cac422149e164c7f861363619e37ea1e1a749be3ea2bd3832d75eb1e4ac51ae2f97514bdeefeaa9c61bbdc8622985f371ba5878be13a40bf7071d858ff175c2e91475f77304a272c1558092d21938ada7a165c39c8f3fd';
  }),
  deletePassword: jest.fn(),
  findCredentials: jest.fn().mockReturnValue([{ account: 'foo' }])
}));

const uuid = '304a57a4-1752-53db-8861-67785534e98e' as TUuid;
const password = 'password';
const privateKey = '0x93b3701cf8eeb6f7d3b22211c691734f24816a02efa933f67f34d37053182577';
const encryptedPrivKey =
  '834a035a579c76cac422149e164c7f861363619e37ea1e1a749be3ea2bd3832d75eb1e4ac51ae2f97514bdeefeaa9c61bbdc8622985f371ba5878be13a40bf7071d858ff175c2e91475f77304a272c1558092d21938ada7a165c39c8f3fd';

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
    (keytar.getPassword as jest.MockedFunction<typeof keytar.getPassword>)
      .mockImplementationOnce(
        async () => 'dc509bcfc343f1bebb4d75749695fd3ef204306f07eff6f86eec91587ba03bbc'
      )
      .mockImplementationOnce(async () => undefined);

    await init(password);
    await expect(getSettingsKey()).resolves.toStrictEqual(
      Buffer.from('2d21938ada7a165c39c8f3fd', 'hex')
    );
    await expect(keytar.setPassword).toHaveBeenCalledWith(
      KEYTAR_SERVICE,
      KEYTAR_SETTINGS_KEY_NAME,
      '815608580c9c799b912045c7421f28d3466d669533eb4a4c444ae03aead3a5992b2559ffe610f2bf2d21938ada7a165c39c8f3fd'
    );
  });

  it('gets and decrypts the settings key from the keychain', async () => {
    (keytar.getPassword as jest.MockedFunction<typeof keytar.getPassword>)
      .mockImplementationOnce(
        async () => 'dc509bcfc343f1bebb4d75749695fd3ef204306f07eff6f86eec91587ba03bbc'
      )
      .mockImplementationOnce(
        async () =>
          '815608580c9c799b912045c7421f28d3466d669533eb4a4c444ae03aead3a5992b2559ffe610f2bf2d21938ada7a165c39c8f3fd'
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
      .mockImplementationOnce(
        async () => 'dc509bcfc343f1bebb4d75749695fd3ef204306f07eff6f86eec91587ba03bbc'
      )
      .mockImplementationOnce(
        async () =>
          '815608580c9c799b912045c7421f28d3466d669533eb4a4c444ae03aead3a5992b2559ffe610f2bf2d21938ada7a165c39c8f3fd'
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
      async () => 'f00f00'
    );

    await expect(getSalt()).resolves.toStrictEqual(Buffer.from('f00f00', 'hex'));
  });
});

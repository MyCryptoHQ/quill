import keytar from 'keytar';

import { KEYTAR_SERVICE } from '@config';
import type { TUuid } from '@types';
import { WalletType } from '@types';

import { deleteAccountSecrets, getPrivateKey, init, saveAccountSecrets } from './secrets';

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
});

describe('deleteAccountSecrets', () => {
  it('calls deletePassword', async () => {
    await deleteAccountSecrets(uuid);

    expect(keytar.deletePassword).toHaveBeenCalledWith(KEYTAR_SERVICE, uuid);
  });
});

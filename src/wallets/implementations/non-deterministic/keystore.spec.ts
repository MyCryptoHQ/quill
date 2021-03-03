import { fKeystore, fKeystorePassword, fPrivateKey } from '@fixtures';

import { Keystore } from './keystore';

describe('Keystore', () => {
  it('decrypts a keystore file with a password', async () => {
    const wallet = new Keystore(fKeystore, fKeystorePassword);
    await expect(wallet.getPrivateKey()).resolves.toBe(fPrivateKey);
  });
});

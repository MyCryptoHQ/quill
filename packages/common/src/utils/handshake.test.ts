import { fEncryptionPrivateKey, fEncryptionPublicKey } from '../__fixtures__';
import { createHandshakeKeyPair } from './handshake';

describe('createHandshakeKeyPair', () => {
  it('generates a random public and private key', async () => {
    await expect(createHandshakeKeyPair()).resolves.toStrictEqual({
      publicKey: fEncryptionPublicKey,
      privateKey: fEncryptionPrivateKey
    });
  });
});

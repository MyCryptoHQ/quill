import { createHandshakeKeyPair } from '@common/utils/handshake';
import { fEncryptionPrivateKey, fEncryptionPublicKey } from '@fixtures';

describe('createHandshakeKeyPair', () => {
  it('generates a random public and private key', async () => {
    await expect(createHandshakeKeyPair()).resolves.toStrictEqual({
      publicKey: fEncryptionPublicKey,
      privateKey: fEncryptionPrivateKey
    });
  });
});

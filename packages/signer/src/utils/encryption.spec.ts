import crypto from 'crypto';

import { createEncryptionKey, decrypt, encrypt, hashPassword } from './encryption';

jest.mock('crypto', () => ({
  ...jest.requireActual('crypto'),
  randomBytes: jest.fn().mockImplementation(() => Buffer.from('2d21938ada7a165c39c8f3fd', 'hex'))
}));

const password = 'test';
const salt = Buffer.from('dc509bcfc343f1bebb4d75749695fd3ef204306f07eff6f86eec91587ba03bbc', 'hex');
const hashedPassword = Buffer.from(
  '6f47c771304e73f322f69a0227bca6ca3e6a9dc3746c0c45ccba606e590cf19e',
  'hex'
);
const data = 'data';
const encryptedData = 'ec06ddd82b70574afee87eaca4432a01ab5fd7492d21938ada7a165c39c8f3fd';

describe('createEncryptionKey', () => {
  it('creates a random 32 byte encryption key', () => {
    (crypto.randomBytes as jest.MockedFunction<
      typeof crypto.randomBytes
    >).mockImplementationOnce(() =>
      Buffer.from('9d4698a3accd9e76f1f5c021eac71e715c3fa5bb3089249b90d30737159905b4', 'hex')
    );

    expect(createEncryptionKey()).toStrictEqual(
      Buffer.from('9d4698a3accd9e76f1f5c021eac71e715c3fa5bb3089249b90d30737159905b4', 'hex')
    );
  });
});

describe('hashPassword', () => {
  it('correctly hashes a string', async () => {
    const result = await hashPassword(password, salt);
    expect(result).toStrictEqual(hashedPassword);
  });
});

describe('encrypt', () => {
  it('correctly encrypts data with AES encryption', () => {
    const encrypted = encrypt('data', hashedPassword);
    expect(encrypted).toBe(encryptedData);
  });
});

describe('decrypt', () => {
  it('correctly decrypts AES encrypted data', () => {
    const decrypted = decrypt(encryptedData, hashedPassword);
    expect(decrypted).toBe(data);
  });
});

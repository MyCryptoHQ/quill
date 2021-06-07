import crypto from 'crypto';

import { createEncryptionKey, decrypt, encrypt, hashPassword } from './encryption';

jest.mock('crypto', () => ({
  ...jest.requireActual('crypto'),
  randomBytes: jest.fn().mockImplementation(() => Buffer.from('2d21938ada7a165c39c8f3fd', 'hex'))
}));

const password = 'test';
const hashedPassword = Buffer.from(
  '181521fd2ec26655207830887e1bc52b33d3ea67bba5f6ec50ea6f21c3964e13',
  'hex'
);
const data = 'data';
const encryptedData = 'bb61fdc07c1303b8bcf9e8618812557fa623c8d32d21938ada7a165c39c8f3fd';

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
  it('correctly SHA256 hashes a string', async () => {
    const result = await hashPassword(password);
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

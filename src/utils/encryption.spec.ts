import type crypto from 'crypto';

import { decrypt, encrypt, hashPassword } from './encryption';

jest.mock('crypto', () => ({
  ...jest.requireActual<typeof crypto>('crypto'),
  randomBytes: jest.fn().mockImplementation(() => Buffer.from('2d21938ada7a165c39c8f3fd', 'hex'))
}));

const password = 'test';
const hashedPassword = Buffer.from(
  'e9a0c40b5c85fc2b5eb8f6084f68b144854cbd38397c947ad49a213ff1fb7e62',
  'hex'
);
const data = 'data';
const encryptedData = '6cb10410ca36d6abcd7ddbed629a0c199f0506792d21938ada7a165c39c8f3fd';

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

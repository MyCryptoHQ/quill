import { utils } from 'aes-js';

import { decrypt, encrypt, hashPassword } from './encryption';

const password = 'test';
const hashedPassword = Buffer.from(
  utils.hex.toBytes('e9a0c40b5c85fc2b5eb8f6084f68b144854cbd38397c947ad49a213ff1fb7e62')
);
const data = 'data';
const encryptedData = '3d753ef4';

describe('hashPassword', () => {
  it('correctly SHA256 hashes a string', async () => {
    const result = await hashPassword(password);
    const expected = hashedPassword;
    expect(result).toStrictEqual(expected);
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

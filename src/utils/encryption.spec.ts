import { decrypt, encrypt, hashPassword } from './encryption';

const password = 'test';
const hashedPassword = '8c09b774b0d1eb6f58be42250700c9decbadc832cb2903d552f2ab6f8a314b04';
const data = 'data';
const encryptedData = 'ab1be0f1';

describe('hashPassword', () => {
  it('correctly SHA256 hashes a string', async () => {
    const result = await hashPassword(password);
    const expected = hashedPassword;
    expect(result).toBe(expected);
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

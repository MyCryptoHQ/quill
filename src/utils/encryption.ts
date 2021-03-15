import { ByteSource, ModeOfOperation, utils } from 'aes-js';
import crypto from 'crypto';

const SALT = 'w//Vd(FlSLgm';
const ITERATIONS = 5000;
const KEY_LENGTH = 32;
const HASH_ALGORITHM = 'sha512';

export const decrypt = (data: string, key: ByteSource) => {
  const aes = new ModeOfOperation.ctr(key);
  const decryptedBytes = aes.decrypt(utils.hex.toBytes(data));
  return utils.utf8.fromBytes(decryptedBytes);
};

export const encrypt = (data: string, key: ByteSource) => {
  const aes = new ModeOfOperation.ctr(key);
  const encryptedBytes = aes.encrypt(utils.utf8.toBytes(data));
  return utils.hex.fromBytes(encryptedBytes);
};

export const hashPassword = (password: string): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    if (!password || password.length === 0) {
      reject(new Error('Password is undefined or of zero length'));
      return;
    }
    crypto.pbkdf2(password, SALT, ITERATIONS, KEY_LENGTH, HASH_ALGORITHM, (error, key) => {
      if (error) {
        reject(error);
      } else {
        resolve(key);
      }
    });
  });
};

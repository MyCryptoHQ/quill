import { ModeOfOperation, utils } from 'aes-js';
import { pbkdf2 } from 'pbkdf2';

const SALT = 'w//Vd(FlSLgm';
const ITERATIONS = 5000;
const KEY_LENGTH = 32;

export const decrypt = (data: string, key: string) => {
  const aes = new ModeOfOperation.ctr(utils.hex.toBytes(key));
  const decryptedBytes = aes.decrypt(utils.hex.toBytes(data));
  return utils.utf8.fromBytes(decryptedBytes);
};

export const encrypt = (data: string, key: string) => {
  const aes = new ModeOfOperation.ctr(utils.hex.toBytes(key));
  const encryptedBytes = aes.encrypt(utils.utf8.toBytes(data));
  return utils.hex.fromBytes(encryptedBytes);
};

export const hashPassword = (password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    pbkdf2(password, SALT, ITERATIONS, KEY_LENGTH, (error, key) => {
      if (error) {
        reject(error);
      }
      resolve(utils.hex.fromBytes(key));
    });
  });
};

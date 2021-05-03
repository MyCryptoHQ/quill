import crypto from 'crypto';
import { promisify } from 'util';

const pbkdf2 = promisify(crypto.pbkdf2);

const SALT = 'w//Vd(FlSLgm';
const ITERATIONS = 1000000;
const KEY_LENGTH = 32;
const HASH_ALGORITHM = 'sha512';

// Recommended IV length for GCM is 12 bytes
const ENCRYPTION_IV_LENGTH = 12;
const ENCRYPTION_TAG_LENGTH = 16;
const ENCRYPTION_ALGORITHM = 'aes-256-gcm';

/**
 * Generates a random encryption key. Currently this is only used as settings key.
 */
export const createEncryptionKey = (size: number = KEY_LENGTH): Buffer => {
  return crypto.randomBytes(size);
};

export const encrypt = (data: string, key: Buffer) => {
  const buffer = Buffer.from(data, 'utf8');
  const iv = crypto.randomBytes(ENCRYPTION_IV_LENGTH);

  const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, key, iv, {
    authTagLength: ENCRYPTION_TAG_LENGTH
  });

  return Buffer.concat([cipher.update(buffer), cipher.final(), cipher.getAuthTag(), iv]).toString(
    'hex'
  );
};

export const decrypt = (data: string, key: Buffer) => {
  const buffer = Buffer.from(data, 'hex');

  const ciphertext = buffer.subarray(0, -ENCRYPTION_IV_LENGTH - ENCRYPTION_TAG_LENGTH);
  const iv = buffer.subarray(-ENCRYPTION_IV_LENGTH);
  const authTag = buffer.subarray(
    -ENCRYPTION_IV_LENGTH - ENCRYPTION_TAG_LENGTH,
    -ENCRYPTION_IV_LENGTH
  );

  const cipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, key, iv, {
    authTagLength: ENCRYPTION_TAG_LENGTH
  });

  cipher.setAuthTag(authTag);

  return Buffer.concat([cipher.update(ciphertext), cipher.final()]).toString('utf8');
};

export const hashPassword = async (password: string): Promise<Buffer> => {
  if (!password || password.length === 0) {
    throw new Error('Password is undefined or of zero length');
  }

  return pbkdf2(password, SALT, ITERATIONS, KEY_LENGTH, HASH_ALGORITHM);
};

import { fEncryptionPrivateKey, fEncryptionPublicKey } from '../__fixtures__';

export class PrivateKey {
  toHex = jest.fn().mockImplementation(() => fEncryptionPrivateKey);

  publicKey = {
    toHex: jest.fn().mockImplementation(() => fEncryptionPublicKey)
  };
}

export const encrypt = jest.requireActual('eciesjs').encrypt;
export const decrypt = jest.requireActual('eciesjs').decrypt;

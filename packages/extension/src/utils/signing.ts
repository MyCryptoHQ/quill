import { stripHexPrefix, toHex } from '@signer/common';
import { utils } from 'noble-ed25519';

export const createRandomPrivateKey = (length: number = 32): string => {
  return stripHexPrefix(toHex(utils.randomPrivateKey(length)));
};

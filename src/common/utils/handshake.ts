import { randomBytes } from '@ethersproject/random';
import { PrivateKey } from 'eciesjs';

import { HandshakeKeyPair } from '@types';

export const createHandshakeKeyPair = async (): Promise<HandshakeKeyPair> => {
  const bytes = randomBytes(32);

  const privateKey = randomBytes(32);
  const publicKey = new PrivateKey(Buffer.from(bytes)).publicKey.uncompressed;

  return { privateKey, publicKey };
};

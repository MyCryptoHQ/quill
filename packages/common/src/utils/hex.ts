import { hexlify } from '@ethersproject/bytes';

export const addHexPrefix = (str: string) => (str.startsWith('0x') ? str : `0x${str}`);

export const stripHexPrefix = (str: string) => (str.startsWith('0x') ? str.substring(2) : str);

export const toHex = (value: Uint8Array) => hexlify(value);

export const getTextEncoder = (): TextEncoder => {
  if (typeof TextEncoder === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Encoder = require('util').TextEncoder;
    return new Encoder();
  }

  return new TextEncoder();
};

export const fromUtf8 = (text: string): Uint8Array => getTextEncoder().encode(text);

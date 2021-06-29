import { hexlify } from '@ethersproject/bytes';

export const addHexPrefix = (str: string) => (str.startsWith('0x') ? str : `0x${str}`);

export const stripHexPrefix = (str: string) => (str.startsWith('0x') ? str.substring(2) : str);

export const toHex = (value: Uint8Array) => hexlify(value);

export const fromUtf8 = (text: string): Uint8Array => new TextEncoder().encode(text);

import { hexlify } from '@ethersproject/bytes';
import { stripHexPrefix } from '@quill/common';
import type { JsonRPCRequest } from '@quill/common';
import stringify from 'fast-json-stable-stringify';
import { sign, utils, verify } from 'noble-ed25519';

export const hashRequest = async (data: JsonRPCRequest) => {
  // Use fast-json-stable-stringify as it is deterministic
  const encoded = Buffer.from(stringify(data), 'utf-8');
  const buffer = await utils.sha512(encoded);
  return stripHexPrefix(hexlify(buffer));
};

export const signRequest = async (data: JsonRPCRequest, privateKey: string) => {
  const hash = await hashRequest(data);
  return sign(hash, privateKey);
};

export const verifyRequest = async (signature: string, data: JsonRPCRequest, publicKey: string) => {
  try {
    const hash = await hashRequest(data);
    return await verify(signature, hash, publicKey);
  } catch {
    return false;
  }
};

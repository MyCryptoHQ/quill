import { hexlify } from '@ethersproject/bytes';
import { decrypt, encrypt } from 'eciesjs';
import stringify from 'fast-json-stable-stringify';
import { getPublicKey, sign, utils } from 'noble-ed25519';
import type { Infer } from 'superstruct';
import { is, object, optional, string, type, unknown } from 'superstruct';

import type { JsonRPCRequest, SignedJsonRPCRequest } from '../types';
import { fromUtf8, stripHexPrefix } from './hex';

const REDUX_ACTION_STRUCT = type({
  type: string(),
  payload: unknown()
});

const ENCRYPTED_ACTION_STRUCT = object({
  data: string(),
  to: optional(string()),
  from: string()
});

export type ReduxAction = Infer<typeof REDUX_ACTION_STRUCT>;
export type EncryptedAction = Infer<typeof ENCRYPTED_ACTION_STRUCT>;

export const isReduxAction = (action: unknown): action is ReduxAction => {
  return is(action, REDUX_ACTION_STRUCT);
};

export const isEncryptedAction = (action: unknown): action is EncryptedAction => {
  return is(action, ENCRYPTED_ACTION_STRUCT);
};

export const encryptJson = (publicKey: string, json: string): string => {
  return hexlify(encrypt(publicKey, Buffer.from(json, 'utf-8')));
};

export const decryptJson = (privateKey: string, action: { data: string }): string => {
  const buffer = decrypt(privateKey, Buffer.from(stripHexPrefix(action.data), 'hex'));
  return buffer.toString('utf-8');
};

export const signJsonRpcRequest = async (
  privateKey: string,
  request: JsonRPCRequest
): Promise<SignedJsonRPCRequest> => {
  const buffer = fromUtf8(stringify(request));
  const hash = stripHexPrefix(hexlify(await utils.sha512(buffer)));
  const signature = await sign(hash, privateKey);

  return { ...request, signature, publicKey: await getPublicKey(privateKey) };
};

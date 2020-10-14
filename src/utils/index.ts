import { TransactionRequest } from '@ethersproject/abstract-provider';

import { JsonRPCRequest } from '@types';

export const makeTx = (request: JsonRPCRequest): TransactionRequest => request.params[0];

export const addHexPrefix = (str: string) => (str.slice(0, 2) === '0x' ? str : `0x${str}`);

export const safeJSONParse = (str: string) => {
  try {
    return [null, JSON.parse(str)];
  } catch (err) {
    console.error(err);
    return [err];
  }
};

export * from './generateUUID';
export { toChecksumAddress } from './toChecksumAddress';

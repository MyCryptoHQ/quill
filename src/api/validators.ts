import { is, Struct, unknown } from 'superstruct';

import { SUPPORTED_METHODS } from '@config';
import { JsonRPCRequest, JSONRPCRequestStruct, SignTransactionStruct } from '@types';

const paramSchemas = {
  [SUPPORTED_METHODS.SIGN_TRANSACTION]: SignTransactionStruct,
  [SUPPORTED_METHODS.ACCOUNTS]: unknown()
};

export const isValidParams = (request: JsonRPCRequest): boolean => {
  return is(request.params, paramSchemas[request.method] as Struct);
};

export const isValidRequest = (request: JsonRPCRequest): boolean => {
  return is(request, JSONRPCRequestStruct);
};

export const isValidMethod = (method: string): boolean => {
  return Object.values(SUPPORTED_METHODS).includes(method);
};

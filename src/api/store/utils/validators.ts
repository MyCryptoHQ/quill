import { is, unknown } from 'superstruct';

import { JsonRPCMethod } from '@config';
import type { JsonRPCRequest } from '@types';
import { JSONRPCRequestStruct, SignTransactionStruct } from '@types';

const paramSchemas = {
  [JsonRPCMethod.SignTransaction]: SignTransactionStruct,
  [JsonRPCMethod.Accounts]: unknown()
};

export const isValidParams = (request: JsonRPCRequest) => {
  return is(request.params, paramSchemas[request.method as JsonRPCMethod]);
};

export const isValidRequest = (request: JsonRPCRequest): boolean => {
  return is(request, JSONRPCRequestStruct);
};

export const isValidMethod = (method: string): method is JsonRPCMethod => {
  return Object.values(JsonRPCMethod).includes(method as JsonRPCMethod);
};

import type { JsonRPCRequest, SignedJsonRPCRequest } from '@signer/common';
import {
  JsonRPCMethod,
  JSONRPCRequestStruct,
  RequestWalletPermissionsStruct,
  SignTransactionStruct
} from '@signer/common';
import { is, unknown } from 'superstruct';

const paramSchemas = {
  [JsonRPCMethod.RequestPermissions]: RequestWalletPermissionsStruct,
  [JsonRPCMethod.GetPermissions]: unknown(),
  [JsonRPCMethod.SignTransaction]: SignTransactionStruct,
  [JsonRPCMethod.Accounts]: unknown()
};

export const isValidParams = (request: JsonRPCRequest) => {
  return is(request.params, paramSchemas[request.method as JsonRPCMethod]);
};

export const isValidRequest = (request: SignedJsonRPCRequest): boolean => {
  return is(request, JSONRPCRequestStruct);
};

export const isValidMethod = (method: string): method is JsonRPCMethod => {
  return Object.values(JsonRPCMethod).includes(method as JsonRPCMethod);
};

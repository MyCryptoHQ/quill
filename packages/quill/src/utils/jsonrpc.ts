import type {
  JsonRPCMethod,
  JsonRPCRequest,
  JsonRPCResponse,
  SignedJsonRPCRequest
} from '@quill/common';

import { signRequest } from './hashing';

export const createSignedJsonRpcRequest = async <Params extends unknown[] = unknown[]>(
  privateKey: string,
  publicKey: string,
  request: JsonRPCRequest<Params>
): Promise<SignedJsonRPCRequest<Params>> => {
  const signature = await signRequest(request, privateKey);
  return { ...request, signature, publicKey };
};

export const createJsonRpcRequest = <Params extends unknown[] = unknown[]>(
  method: JsonRPCMethod,
  id: number = 0,
  params?: Params
): JsonRPCRequest<Params> => ({
  jsonrpc: '2.0',
  id,
  method,
  params
});

export const toJsonRpcResponse = (response: JsonRPCResponse) => {
  return { jsonrpc: '2.0', ...response };
};

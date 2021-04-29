import type { JsonRPCMethod } from '@config';
import type { JsonRPCRequest, JsonRPCRequestWithHash, JsonRPCResponse } from '@types';

import { hashRequest, signRequest } from './hashing';

export const createSignedJsonRpcRequest = async <Params extends unknown[] = unknown[]>(
  privateKey: string,
  request: JsonRPCRequest<Params>
): Promise<JsonRPCRequestWithHash<Params>> => {
  const hash = await hashRequest(request);
  const sig = await signRequest(hash, privateKey);
  return { ...request, hash, sig };
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

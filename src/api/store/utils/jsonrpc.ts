import type { JsonRPCMethod } from '@config';
import type { JsonRPCRequest, JsonRPCResponse } from '@types';

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

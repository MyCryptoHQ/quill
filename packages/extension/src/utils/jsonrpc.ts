import type { JsonRPCError, JsonRPCRequest, JsonRPCResponse } from '@signer/common';

import type { RelayMessage } from '../types';

export const toJsonRpcRequest = (message: RelayMessage): JsonRPCRequest => ({
  jsonrpc: '2.0',
  id: message.id,
  method: message.payload.method,
  // @todo: Handle object params
  params: Array.isArray(message.payload.params) ? message.payload.params : []
});

export const normalizeRequest = <T = unknown[]>(request: JsonRPCRequest<T>): JsonRPCRequest<T> => {
  // The signer does not support broadcasting transactions, so instead we ask it to sign a
  // transaction and broadcast the transaction from the Chrome extension.
  if (request.method === 'eth_sendTransaction') {
    return { ...request, method: 'eth_signTransaction' };
  }

  return request;
};

export const isJsonRpcError = <Result, Error>(
  response: JsonRPCResponse<Result, Error>
): response is JsonRPCError<Error> => {
  return 'error' in response;
};

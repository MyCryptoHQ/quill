import type { JsonRPCError, JsonRPCRequest, JsonRPCResponse } from '@signer/common';

import type { ApplicationState } from '../store';
import type { RelayMessage } from '../types';

export const toJsonRpcRequest = (message: RelayMessage): JsonRPCRequest => ({
  jsonrpc: '2.0',
  id: message.id,
  method: message.payload.method,
  // @todo: Handle object params
  params: Array.isArray(message.payload.params) ? message.payload.params : []
});

export const addChainId = (
  params: unknown[] | undefined,
  chainId: number
): unknown[] | undefined => {
  if (!Array.isArray(params)) {
    return undefined;
  }

  return [{ ...((params[0] as Record<string, unknown>) ?? {}), chainId }];
};

export const normalizeRequest = (
  request: JsonRPCRequest,
  state: ApplicationState
): JsonRPCRequest => {
  // The signer does not support broadcasting transactions, so instead we ask it to sign a
  // transaction and broadcast the transaction from the Chrome extension.
  if (request.method === 'eth_sendTransaction') {
    return {
      ...request,
      method: 'eth_signTransaction',
      params: addChainId(request.params, state.jsonrpc.network.chainId)
    };
  }

  // `eth_requestAccounts` is internally equivalent to calling `wallet_requestPermissions` with just
  // the `eth_accounts` permission.
  if (request.method === 'eth_requestAccounts') {
    return {
      ...request,
      method: 'wallet_requestPermissions',
      params: [
        {
          eth_accounts: {}
        }
      ]
    };
  }

  // The signer isn't aware of the chain ID used by the extension, so we add it to the params when
  // signing transactions. Note that this is technically not JSON-RPC compliant.
  if (request.method === 'eth_signTransaction') {
    return {
      ...request,
      params: addChainId(request.params, state.jsonrpc.network.chainId)
    };
  }

  return request;
};

export const isJsonRpcError = <Result, Error>(
  response: JsonRPCResponse<Result, Error>
): response is JsonRPCError<Error> => {
  return 'error' in response;
};

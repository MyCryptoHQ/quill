import { hexlify } from '@ethersproject/bytes';
import { FallbackProvider, JsonRpcProvider } from '@ethersproject/providers';
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

export const addMissingParams = async (
  params: unknown[] | undefined,
  state: ApplicationState
): Promise<unknown[] | undefined> => {
  if (!Array.isArray(params)) {
    return undefined;
  }

  const providers = state.jsonrpc.network.providers;
  const provider = new FallbackProvider(providers.map((url) => new JsonRpcProvider(url)));

  // @ts-expect-error No type atm
  const nonce = params[0].nonce ?? hexlify(await provider.getTransactionCount(params[0].from));

  // @todo Respect chainId from params if possible?
  const chainId = state.jsonrpc.network.chainId;

  return [{ ...((params[0] as Record<string, unknown>) ?? {}), nonce, chainId }];
};

export const normalizeRequest = async (
  request: JsonRPCRequest,
  state: ApplicationState
): Promise<JsonRPCRequest> => {
  // The signer does not support broadcasting transactions, so instead we ask it to sign a
  // transaction and broadcast the transaction from the Chrome extension.
  if (request.method === 'eth_sendTransaction') {
    return {
      ...request,
      method: 'eth_signTransaction',
      params: await addMissingParams(request.params, state)
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
      params: await addMissingParams(request.params, state)
    };
  }

  return request;
};

export const isJsonRpcError = <Result, Error>(
  response: JsonRPCResponse<Result, Error>
): response is JsonRPCError<Error> => {
  return 'error' in response;
};

import { hexlify } from '@ethersproject/bytes';
import { FallbackProvider, JsonRpcProvider } from '@ethersproject/providers';
import type {
  JsonRPCError,
  JsonRPCRequest,
  JsonRPCResponse,
  TSignTransaction
} from '@signer/common';
import type { Optional } from 'utility-types';

import type { ApplicationState } from '../store';
import type { RelayMessage } from '../types';

export const toJsonRpcRequest = (message: RelayMessage): JsonRPCRequest => ({
  jsonrpc: '2.0',
  id: message.id,
  method: message.payload.method,
  // @todo: Handle object params
  params: Array.isArray(message.payload.params) ? message.payload.params : []
});

export type TParams = [Omit<Optional<TSignTransaction[0], 'nonce'>, 'chainId'>];

export const resolveNonce = async (params: TParams, state: ApplicationState) => {
  if (params[0].nonce) {
    return params[0].nonce;
  }

  const providers = state.jsonrpc.network.providers;
  const provider = new FallbackProvider(providers.map((url) => new JsonRpcProvider(url)));

  if (params[0].from) {
    return hexlify(await provider.getTransactionCount(params[0].from!));
  }
  return null;
};

export const addMissingParams = async (
  params: TParams | undefined,
  state: ApplicationState
): Promise<unknown[] | undefined> => {
  if (!Array.isArray(params)) {
    return undefined;
  }

  const nonce = await resolveNonce(params, state);

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
      params: await addMissingParams(request.params as TSignTransaction, state)
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
      params: await addMissingParams(request.params as TSignTransaction, state)
    };
  }

  return request;
};

export const isJsonRpcError = <Result, Error>(
  response: JsonRPCResponse<Result, Error>
): response is JsonRPCError<Error> => {
  return 'error' in response;
};

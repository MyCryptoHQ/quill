import type { ApplicationState } from '../store';
import { RelayTarget } from '../types';
import { addChainId, isJsonRpcError, normalizeRequest, toJsonRpcRequest } from './jsonrpc';

describe('toJsonRpcRequest', () => {
  it('returns a JSON-RPC compatible request for a relay message', () => {
    const message = {
      id: 'foo',
      target: RelayTarget.Background,
      payload: {
        method: 'eth_accounts',
        params: []
      }
    };

    expect(toJsonRpcRequest(message)).toStrictEqual({
      jsonrpc: '2.0',
      id: 'foo',
      method: 'eth_accounts',
      params: []
    });
  });
});

describe('addChainId', () => {
  it('adds the chain ID to the request parameters', () => {
    expect(addChainId([{ foo: 'bar' }], 1)).toStrictEqual([
      {
        foo: 'bar',
        chainId: 1
      }
    ]);
  });

  it('returns undefined if no parameters are specified', () => {
    expect(addChainId(undefined, 1)).toBeUndefined();
  });
});

describe('normalizeRequest', () => {
  const request = {
    jsonrpc: '2.0' as const,
    id: 'foo',
    method: 'eth_sendTransaction',
    params: []
  };

  const state = {
    jsonrpc: {
      network: {
        chainId: 1
      }
    }
  } as ApplicationState;

  it('normalizes specific JSON-RPC requests', () => {
    expect(normalizeRequest(request, state)).toStrictEqual({
      ...request,
      method: 'eth_signTransaction',
      params: [
        {
          chainId: 1
        }
      ]
    });

    expect(
      normalizeRequest({ ...request, method: 'eth_requestAccounts', params: [] }, state)
    ).toStrictEqual({
      ...request,
      method: 'wallet_requestPermissions',
      params: [
        {
          eth_accounts: {}
        }
      ]
    });

    expect(
      normalizeRequest({ ...request, method: 'eth_signTransaction', params: [] }, state)
    ).toStrictEqual({
      ...request,
      method: 'eth_signTransaction',
      params: [
        {
          chainId: 1
        }
      ]
    });
  });

  it('returns the same request for other requests', () => {
    expect(normalizeRequest({ ...request, method: 'eth_accounts' }, state)).toStrictEqual({
      ...request,
      method: 'eth_accounts'
    });
  });
});

describe('isJsonRpcError', () => {
  it('checks if a JSON-RPC response is an error response', () => {
    expect(
      isJsonRpcError({
        id: 'foo',
        error: {
          message: 'foo',
          code: '-1'
        }
      })
    ).toBe(true);

    expect(
      isJsonRpcError({
        id: 'foo',
        result: '0xf000'
      })
    ).toBe(false);
  });
});

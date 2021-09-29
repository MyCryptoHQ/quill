import type { TParams } from '.';
import type { ApplicationState } from '../store';
import { RelayTarget } from '../types';
import { addMissingParams, isJsonRpcError, normalizeRequest, toJsonRpcRequest } from './jsonrpc';

jest.mock('@ethersproject/providers', () => ({
  ...jest.requireActual('@ethersproject/providers'),
  FallbackProvider: jest.fn().mockImplementation(() => ({
    getTransactionCount: jest.fn().mockResolvedValue(2)
  }))
}));

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

const state = {
  jsonrpc: {
    network: {
      providers: ['https://example.com'],
      chainId: 1
    }
  }
} as ApplicationState;

const params: TParams = [
  {
    gasPrice: '0x012a05f200',
    gas: '0x5208',
    from: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520',
    to: '0xb2bb2b958AFa2e96dab3f3Ce7162b87daEa39017',
    value: '0x2386f26fc10000',
    data: '0x'
  }
];

describe('addMissingParams', () => {
  it('adds the chain ID and nonce to the request parameters', () => {
    return expect(addMissingParams(params, state)).resolves.toStrictEqual([
      {
        ...params[0],
        nonce: '0x02',
        chainId: 1
      }
    ]);
  });

  it('nulls nonce if not able to estimate', () => {
    return expect(
      addMissingParams([{ ...params[0], nonce: undefined, from: undefined }], state)
    ).resolves.toStrictEqual([
      {
        ...params[0],
        from: undefined,
        nonce: null,
        chainId: 1
      }
    ]);
  });

  it('returns undefined if no parameters are specified', () => {
    return expect(addMissingParams(undefined, state)).resolves.toBeUndefined();
  });
});

describe('normalizeRequest', () => {
  const request = {
    jsonrpc: '2.0' as const,
    id: 'foo',
    method: 'eth_sendTransaction',
    params
  };

  it('normalizes specific JSON-RPC requests', async () => {
    await expect(normalizeRequest(request, state)).resolves.toStrictEqual({
      ...request,
      method: 'eth_signTransaction',
      params: [
        {
          ...params[0],
          nonce: '0x02',
          chainId: 1
        }
      ]
    });

    await expect(
      normalizeRequest({ ...request, method: 'eth_requestAccounts', params: [] }, state)
    ).resolves.toStrictEqual({
      ...request,
      method: 'wallet_requestPermissions',
      params: [
        {
          eth_accounts: {}
        }
      ]
    });
  });

  it('returns the same request for other requests', () => {
    return expect(
      normalizeRequest({ ...request, method: 'eth_accounts' }, state)
    ).resolves.toStrictEqual({
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

import { RelayTarget } from '../types';
import { toJsonRpcRequest } from './jsonrpc';

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

import { JsonRPCMethod } from '@quill/common';

import { fRequestPrivateKey, fRequestPublicKey } from '@fixtures';
import { createSignedJsonRpcRequest } from '@utils';

import { isValidParams, isValidRequest } from './validators';

describe('isValidRequest', () => {
  it('detects valid requests', async () => {
    const request = {
      id: 1,
      method: JsonRPCMethod.SignTransaction,
      jsonrpc: '2.0' as const,
      params: [
        {
          to: '0x',
          from: '0x',
          nonce: '0x1',
          gasLimit: '0x',
          gasPrice: '0x',
          data: '0x',
          value: '0x',
          chainId: 3
        }
      ]
    };
    const signedRequest = await createSignedJsonRpcRequest(
      fRequestPrivateKey,
      fRequestPublicKey,
      request
    );
    const valid = isValidRequest(signedRequest);
    expect(valid).toBe(true);
  });
});

describe('isValidParams', () => {
  it('detects invalid request if params dont match method schema', () => {
    const valid = isValidParams({
      id: 1,
      method: JsonRPCMethod.SignTransaction,
      jsonrpc: '2.0',
      params: []
    });
    expect(valid).toBe(false);
  });

  it('detects invalid requests without params', () => {
    const valid = isValidParams({
      id: 1,
      method: JsonRPCMethod.SignTransaction,
      jsonrpc: '2.0'
    });
    expect(valid).toBe(false);
  });
});

import { JsonRPCMethod } from '@config';

import { isValidParams, isValidRequest } from './validators';

describe('isValidRequest', () => {
  it('detects valid requests', () => {
    const valid = isValidRequest({
      id: 1,
      method: JsonRPCMethod.SignTransaction,
      jsonrpc: '2.0',
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
      ],
      hash: '',
      sig: ''
    });
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

import { SUPPORTED_METHODS } from '@config';

import { isValidRequest } from './validators';

describe('isValidRequest', () => {
  it('detects valid requests', () => {
    const valid = isValidRequest({
      id: 1,
      method: SUPPORTED_METHODS.SIGN_TRANSACTION,
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
      ]
    });
    expect(valid).toBe(true);
  });

  it('detects invalid request if params dont match method schema', () => {
    const valid = isValidRequest({
      id: 1,
      method: SUPPORTED_METHODS.SIGN_TRANSACTION,
      jsonrpc: '2.0',
      params: []
    });
    expect(valid).toBe(false);
  });

  it('detects invalid requests without params', () => {
    const valid = isValidRequest({
      id: 1,
      method: SUPPORTED_METHODS.SIGN_TRANSACTION,
      jsonrpc: '2.0'
    } as any);
    expect(valid).toBe(false);
  });
});

import { CryptoRequestType } from '@types';

import { handleRequest } from './crypto';

jest.mock('@ethersproject/wallet', () => ({
  Wallet: jest.fn().mockImplementation(() => ({
    address: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520',
    signTransaction: jest.fn().mockImplementation(() => Promise.resolve('signed'))
  }))
}));

describe('handleRequest', () => {
  it('GET_ADDRESS returns address and uuid', async () => {
    const response = await handleRequest({
      type: CryptoRequestType.GET_ADDRESS,
      privateKey: 'privkey'
    });

    expect(response).toStrictEqual({
      address: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520',
      uuid: '4be38596-5d9c-5c01-8e04-19d1c726fe24'
    });
  });

  it('SIGN returns signed tx', async () => {
    const response = await handleRequest({
      type: CryptoRequestType.SIGN,
      privateKey: 'privkey',
      tx: {}
    });

    expect(response).toBe('signed');
  });
});

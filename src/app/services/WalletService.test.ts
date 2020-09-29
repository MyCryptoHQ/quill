import { ipcBridge } from '@bridge';

import { signWithPrivateKey } from './WalletService';

jest.mock('@bridge', () => ({
  ipcBridge: {
    signTransaction: jest.fn()
  }
}));

describe('WalletService', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('calls ipcBridge sign transaction function', () => {
    signWithPrivateKey('privkey', {});
    expect(ipcBridge.signTransaction).toHaveBeenCalledWith({ privateKey: 'privkey', tx: {} });
  });
});

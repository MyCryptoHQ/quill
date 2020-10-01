import { ipcBridgeRenderer } from '@bridge';

import { signWithPrivateKey } from './WalletService';

jest.mock('@bridge', () => ({
  ipcBridgeRenderer: {
    crypto: {
      invoke: jest.fn()
    }
  }
}));

describe('WalletService', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('calls ipcBridge sign transaction function', () => {
    signWithPrivateKey('privkey', {});
    expect(ipcBridgeRenderer.crypto.invoke).toHaveBeenCalledWith({ privateKey: 'privkey', tx: {} });
  });
});

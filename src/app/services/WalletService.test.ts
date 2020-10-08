import { ipcBridgeRenderer } from '@bridge';
import { CryptoRequestType } from '@types';

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
    expect(ipcBridgeRenderer.crypto.invoke).toHaveBeenCalledWith({
      type: CryptoRequestType.SIGN,
      privateKey: 'privkey',
      tx: {}
    });
  });
});

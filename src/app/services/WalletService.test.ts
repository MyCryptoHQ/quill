import { ipcBridgeRenderer } from '@bridge';
import { CryptoRequestType, WalletType } from '@types';

import { createMnemonic, getAddress, signWithPrivateKey } from './WalletService';

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

  it('calls ipcBridge get address function', () => {
    const request = { wallet: WalletType.PRIVATE_KEY, args: 'privkey' };
    getAddress(request);
    expect(ipcBridgeRenderer.crypto.invoke).toHaveBeenCalledWith({
      type: CryptoRequestType.GET_ADDRESS,
      ...request
    });
  });

  it('calls ipcBridge create mnemonic', () => {
    createMnemonic();
    expect(ipcBridgeRenderer.crypto.invoke).toHaveBeenCalledWith({
      type: CryptoRequestType.CREATE_WALLET,
      wallet: WalletType.MNEMONIC
    });
  });
});

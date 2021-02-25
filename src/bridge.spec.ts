import { IpcRenderer } from 'electron';

import { IpcBridgeRenderer } from '@bridge';
import { IPC_CHANNELS } from '@config';
import { CryptoRequest, CryptoRequestType, WalletType } from '@types';

const mockIpcRenderer = ({
  send: jest.fn(),
  on: jest.fn().mockImplementation((_e, callback) => {
    callback();
  }),
  invoke: jest.fn(),
  handle: jest.fn(),
  removeListener: jest.fn()
} as unknown) as IpcRenderer;

describe('IpcBridgeRenderer', () => {
  it('api.sendResponse calls ipcRenderer.send', async () => {
    const response = { id: 1, result: '0x' };
    IpcBridgeRenderer(mockIpcRenderer).api.sendResponse(response);
    expect(mockIpcRenderer.send).toHaveBeenCalledWith(IPC_CHANNELS.API, response);
  });

  it('api.subscribeToRequests calls ipcRenderer.on', async () => {
    const listener = jest.fn();
    const unsubscribe = IpcBridgeRenderer(mockIpcRenderer).api.subscribeToRequests(listener);
    expect(mockIpcRenderer.on).toHaveBeenCalledWith(IPC_CHANNELS.API, expect.any(Function));
    expect(listener).toHaveBeenCalled();
    unsubscribe();
    expect(mockIpcRenderer.removeListener).toHaveBeenCalledWith(
      IPC_CHANNELS.API,
      expect.any(Function)
    );
  });

  it('crypto.invoke calls ipcRenderer.invoke', async () => {
    const request: CryptoRequest = {
      type: CryptoRequestType.GET_ADDRESS,
      wallet: {
        walletType: WalletType.PRIVATE_KEY,
        privateKey: '0x93b3701cf8eeb6f7d3b22211c691734f24816a02efa933f67f34d37053182577'
      }
    };
    IpcBridgeRenderer(mockIpcRenderer).crypto.invoke(request);
    expect(mockIpcRenderer.invoke).toHaveBeenCalledWith(IPC_CHANNELS.CRYPTO, request);
  });
});

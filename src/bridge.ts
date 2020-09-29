import { TransactionRequest, TransactionResponse } from '@ethersproject/abstract-provider';
import { ipcRenderer as IpcRenderer, IpcRendererEvent } from 'electron';

import { IPC_CHANNELS, JsonRPCRequest, JsonRPCResponse } from '@types';

type Unsubscribe = () => void;
type Listener = (...args: any[]) => void;

export interface IIpcBridge {
  sendResponse(data: Omit<JsonRPCResponse, 'jsonrpc'>): void;
  subscribeToRequests(listener: Listener): Unsubscribe;
  signTransaction(obj: {
    privateKey: string;
    tx: TransactionRequest;
  }): Promise<TransactionResponse>;
}

// Locked down according to: https://www.electronjs.org/docs/tutorial/context-isolation
export const IpcBridge = (ipcRenderer: typeof IpcRenderer): IIpcBridge => ({
  sendResponse: (data: Omit<JsonRPCResponse, 'jsonrpc'>) => {
    ipcRenderer.send(IPC_CHANNELS.API, data);
  },
  subscribeToRequests: (listener: (request: JsonRPCRequest) => void) => {
    const subscription = (_: IpcRendererEvent, request: JsonRPCRequest) => listener(request);
    ipcRenderer.on(IPC_CHANNELS.API, subscription);

    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.API, subscription);
    };
  },
  signTransaction: ({ privateKey, tx }) => {
    return ipcRenderer.invoke(IPC_CHANNELS.CRYPTO, { privateKey, tx });
  }
});

export const { ipcBridge } = window;

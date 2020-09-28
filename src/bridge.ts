import { ipcRenderer as IpcRenderer } from 'electron';

import { IPC_CHANNELS } from '@types';

type Unsubscribe = () => void;
type Listener = (...args: any[]) => void;

export interface IIpcBridge {
  send(channel: string, data: any): void;
  subscribe(channel: string, listener: Listener): Unsubscribe;
  invoke(channel: string, ...args: any[]): Promise<any>;
}

const isValidChannel = (channel: string) => Object.values(IPC_CHANNELS).includes(channel);

// @todo LOCK DOWN MORE
export const IpcBridge = (ipcRenderer: typeof IpcRenderer): IIpcBridge => ({
  send: (channel: string, data: any) => {
    if (!isValidChannel(channel)) {
      // Fail hard here so we don't forget to use static channels
      throw Error('Invalid Channel');
    }
    ipcRenderer.send(channel, data);
  },
  subscribe: (channel: string, listener: (...args: any[]) => void) => {
    if (!isValidChannel(channel)) {
      // Fail hard here so we don't forget to use static channels
      throw Error('Invalid Channel');
    }
    const subscription = (_: any, ...args: any[]) => listener(...args);
    ipcRenderer.on(channel, subscription);

    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },
  invoke: (channel: string, ...args: any[]) => {
    if (!isValidChannel(channel)) {
      // Fail hard here so we don't forget to use static channels
      throw Error('Invalid Channel');
    }
    return ipcRenderer.invoke(channel, ...args);
  }
});

export const { ipcBridge } = window;

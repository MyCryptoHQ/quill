// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

// https://dennistretyakov.com/ipc-render-in-cra-managed-app

import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('appRuntime', {
  send: (channel: string, data: any) => {
    ipcRenderer.send(channel, data);
  },
  subscribe: (channel: string, listener: (...args: any[]) => void) => {
    const subscription = (_: any, ...args: any[]) => listener(...args);
    ipcRenderer.on(channel, subscription);

    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },
});

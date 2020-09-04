// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

// https://dennistretyakov.com/ipc-render-in-cra-managed-app

import { contextBridge, ipcRenderer } from 'electron';
import { IpcBridge } from '@bridge';

contextBridge.exposeInMainWorld('ipcBridge', IpcBridge(ipcRenderer));

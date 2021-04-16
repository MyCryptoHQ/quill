import type { IIpcBridge } from '@bridge';

declare global {
  interface Window {
    ipcBridge: IIpcBridge;
  }
}

import { IpcBridge } from '@bridge';

declare global {
  interface Window {
    ipcBridge: IpcBridge;
  }
}

import { Process } from '@quill/common';
import type { BrowserWindow, IpcMainEvent } from 'electron';
import { ipcMain } from 'electron';

import { ipcBridgeMain } from '@bridge';
import type { createCryptoProcess } from '@crypto/process';

export const createIpc = (
  window: BrowserWindow,
  cryptoProcess: ReturnType<typeof createCryptoProcess>
) => ({
  [Process.Renderer]: ipcBridgeMain(ipcMain, window.webContents).redux,
  [Process.Crypto]: {
    on: (listener: (event: IpcMainEvent, ...args: unknown[]) => void) => {
      const callback = (msg: unknown) => listener(undefined, msg);
      cryptoProcess.on('message', callback);
      return () => {
        cryptoProcess.removeListener('message', callback);
      };
    },
    emit: (args: string) => cryptoProcess.send(args)
  }
});

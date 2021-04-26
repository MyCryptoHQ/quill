import type { createCryptoProcess } from '@signing/signing';
import type { BrowserWindow, IpcMainEvent } from 'electron';
import { ipcMain } from 'electron';

import { ipcBridgeMain } from '@bridge';
import { Process } from '@common/store';

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

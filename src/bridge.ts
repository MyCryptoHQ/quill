import type { IpcMain, IpcMainEvent, IpcRenderer, IpcRendererEvent, WebContents } from 'electron';

export const REDUX_CHANNEL = 'redux';

const getChannel = (channel: string) => {
  // @todo: CHECK CHANNEL VALIDITY

  const asRenderer = (ipcRenderer: IpcRenderer) => ({
    emit: (...args: unknown[]) => ipcRenderer.send(channel, ...args),
    on: (listener: (event: IpcRendererEvent, ...args: unknown[]) => void) => {
      ipcRenderer.on(channel, listener);

      return () => {
        ipcRenderer.removeListener(channel, listener);
      };
    }
  });

  const asMain = (ipcMain: IpcMain, webContents: WebContents) => ({
    emit: (...args: unknown[]) => webContents.send(channel, ...args),
    on: (listener: (event: IpcMainEvent, ...args: unknown[]) => void) => {
      ipcMain.on(channel, listener);

      return () => {
        ipcMain.removeListener(channel, listener);
      };
    }
  });

  return { asRenderer, asMain };
};

// Locked down according to: https://www.electronjs.org/docs/tutorial/context-isolation
export const IpcBridgeRenderer = (ipcRenderer: IpcRenderer) => ({
  // These are constants as to not leak the ipcRenderer
  redux: getChannel(REDUX_CHANNEL).asRenderer(ipcRenderer)
});

export const ipcBridgeRenderer = (typeof window !== 'undefined'
  ? window.ipcBridge
  : undefined) as ReturnType<typeof IpcBridgeRenderer>;

export const ipcBridgeMain = (ipcMain: IpcMain, webContents: WebContents) => ({
  redux: getChannel(REDUX_CHANNEL).asMain(ipcMain, webContents)
});

export type IIpcBridgeRenderer = ReturnType<typeof IpcBridgeRenderer>;
export type IIpcBridgeMain = ReturnType<typeof ipcBridgeMain>;

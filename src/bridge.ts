import type { IpcMain, IpcMainEvent, IpcRenderer, IpcRendererEvent, WebContents } from 'electron';

import { IPC_CHANNELS } from '@config';
import type {
  DBRequest,
  DBResponse,
  JsonRPCRequest,
  JsonRPCResponse
} from '@types';

const getAPIChannel = () => {
  const asRenderer = (ipcRenderer: IpcRenderer) => ({
    sendResponse: (data: Omit<JsonRPCResponse, 'jsonrpc'>) => {
      ipcRenderer.send(IPC_CHANNELS.API, data);
    },
    subscribeToRequests: (listener: (request: JsonRPCRequest) => void) => {
      const subscription = (_: IpcRendererEvent, request: JsonRPCRequest) => listener(request);
      ipcRenderer.on(IPC_CHANNELS.API, subscription);

      return () => {
        ipcRenderer.removeListener(IPC_CHANNELS.API, subscription);
      };
    }
  });

  const asMain = (ipcMain: IpcMain) => ({
    on: (
      handler: (event: Electron.IpcMainEvent, response: Omit<JsonRPCResponse, 'jsonrpc'>) => void
    ) => ipcMain.on(IPC_CHANNELS.API, handler)
  });

  return {
    asRenderer,
    asMain
  };
};

const getChannel = <A, B>(channel: IPC_CHANNELS) => {
  // @todo: CHECK CHANNEL VALIDITY

  const asRenderer = (ipcRenderer: IpcRenderer) => ({
    emit: (...args: unknown[]) => ipcRenderer.send(channel, ...args),
    on: (listener: (event: IpcRendererEvent, ...args: unknown[]) => void) => {
      ipcRenderer.on(channel, listener);

      return () => {
        ipcRenderer.removeListener(channel, listener);
      };
    },
    invoke: (request: A) => ipcRenderer.invoke(channel, request)
  });

  const asMain = (ipcMain: IpcMain, webContents: WebContents) => ({
    emit: (...args: unknown[]) => webContents.send(channel, ...args),
    on: (listener: (event: IpcMainEvent, ...args: unknown[]) => void) => {
      ipcMain.on(channel, listener);

      return () => {
        ipcMain.removeListener(channel, listener);
      };
    },
    handle: (handler: (event: Electron.IpcMainEvent, request: A) => Promise<B>) =>
      ipcMain.handle(channel, handler)
  });

  return { asRenderer, asMain };
};

// Locked down according to: https://www.electronjs.org/docs/tutorial/context-isolation
export const IpcBridgeRenderer = (ipcRenderer: IpcRenderer) => ({
  // These are constants as to not leak the ipcRenderer
  redux: getChannel(IPC_CHANNELS.REDUX).asRenderer(ipcRenderer),
  api: getAPIChannel().asRenderer(ipcRenderer),
  db: getChannel<DBRequest, DBResponse>(IPC_CHANNELS.DATABASE).asRenderer(ipcRenderer)
});

export const ipcBridgeRenderer = (typeof window !== 'undefined'
  ? window.ipcBridge
  : undefined) as IIpcBridgeRenderer;

export const ipcBridgeMain = (ipcMain: IpcMain, webContents: WebContents) => ({
  redux: getChannel(IPC_CHANNELS.REDUX).asMain(ipcMain, webContents),
  api: getAPIChannel().asMain(ipcMain),
  db: getChannel<DBRequest, DBResponse>(IPC_CHANNELS.DATABASE).asMain(ipcMain, webContents)
});

export type IIpcBridgeRenderer = ReturnType<typeof IpcBridgeRenderer>;

export type IIpcBridgeMain = ReturnType<typeof ipcBridgeMain>;

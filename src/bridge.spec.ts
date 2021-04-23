import type { IpcMain, IpcRenderer, WebContents } from 'electron';

import { ipcBridgeMain, IpcBridgeRenderer, REDUX_CHANNEL } from '@bridge';

jest.unmock('@bridge');

describe('ipcBridgeRenderer', () => {
  const ipcRenderer = ({
    send: jest.fn(),
    on: jest.fn().mockImplementation((_, callback) => {
      callback();
    }),
    removeListener: jest.fn()
  } as unknown) as IpcRenderer;

  describe('emit', () => {
    it('sends an event', () => {
      const ipc = IpcBridgeRenderer(ipcRenderer).redux;
      ipc.emit('foo');

      expect(ipcRenderer.send).toHaveBeenCalledWith(REDUX_CHANNEL, 'foo');
    });
  });

  describe('on', () => {
    it('listens to an event and returns an unsubscribe function', () => {
      const listener = jest.fn();
      const ipc = IpcBridgeRenderer(ipcRenderer).redux;
      const unsubscribe = ipc.on(listener);

      unsubscribe();

      expect(ipcRenderer.on).toHaveBeenCalledWith(REDUX_CHANNEL, listener);
      expect(ipcRenderer.removeListener).toHaveBeenCalledWith(REDUX_CHANNEL, listener);
    });
  });
});

describe('ipcBridgeMain', () => {
  const ipcMain = ({
    send: jest.fn(),
    on: jest.fn().mockImplementation((_, callback) => {
      callback();
    }),
    removeListener: jest.fn()
  } as unknown) as IpcMain;

  const webContents = ({
    send: jest.fn()
  } as unknown) as WebContents;

  describe('emit', () => {
    it('sends an event', () => {
      const ipc = ipcBridgeMain(ipcMain, webContents).redux;
      ipc.emit('foo');

      expect(webContents.send).toHaveBeenCalledWith(REDUX_CHANNEL, 'foo');
    });
  });

  describe('on', () => {
    it('listens to an event and returns an unsubscribe function', () => {
      const listener = jest.fn();
      const ipc = ipcBridgeMain(ipcMain, webContents).redux;
      const unsubscribe = ipc.on(listener);

      unsubscribe();

      expect(ipcMain.on).toHaveBeenCalledWith(REDUX_CHANNEL, listener);
      expect(ipcMain.removeListener).toHaveBeenCalledWith(REDUX_CHANNEL, listener);
    });
  });
});

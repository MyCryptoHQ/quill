import { app, BrowserWindow, Menu, shell, Tray } from 'electron';
import positioner from 'electron-traywindow-positioner';
import path from 'path';
import { URL } from 'url';

import { HEIGHT, WIDTH } from '@config';
import { createCryptoProcess } from '@crypto/process';
import { showWindowOnTop } from '@utils';

import { createStore } from './api';
import { createKeyPair } from './common/store';
import { createIpc } from './ipc';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line global-require
if (require('electron-squirrel-startup')) {
  app.quit();
}

let tray: Tray;
let window: BrowserWindow;

const isDev = process.env.NODE_ENV === 'development';

const createWindow = (): void => {
  // Create the browser window.
  window = new BrowserWindow({
    icon: path.join(__dirname, 'icon.png'),
    width: WIDTH,
    height: HEIGHT,
    fullscreenable: false,
    resizable: isDev,
    // Spectron fails randomly when the app is frameless
    // We don't use NODE_ENV as it is controlled by electron-forge
    frame: process.env.IS_TEST === 'true',
    transparent: true,
    webPreferences: {
      devTools: isDev,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      // For security reasons the following params should not be modified
      // https://electronjs.org/docs/tutorial/security#isolation-for-untrusted-content
      nodeIntegration: false,
      contextIsolation: true,
      worldSafeExecuteJavaScript: true
    }
  });

  window.webContents.on('new-window', (event, value) => {
    event.preventDefault();

    const url = new URL(value);
    if (url.protocol !== 'https:') {
      return console.warn(
        `Blocked request to open new window '${value}', only HTTPS links are allowed`
      );
    }

    shell.openExternal(value);
  });

  const cryptoProcess = createCryptoProcess();
  const ipc = createIpc(window, cryptoProcess);
  const store = createStore(window, ipc);

  store.dispatch(createKeyPair());

  // and load the index.html of the app.
  window.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
};

const showWindow = () => {
  const windowBounds = window.getBounds();
  const trayBounds = tray.getBounds();
  const position = positioner.calculate(windowBounds, trayBounds);
  window.setPosition(position.x, position.y, false);
  // Added because setPosition would sometimes squeeze the sizing
  window.setSize(WIDTH, HEIGHT, false);
  showWindowOnTop(window);
  if (isDev) {
    window.webContents.openDevTools({ mode: 'undocked' });
  }
};

const hideWindow = () => window.hide();

const toggleWindow = () => (window.isVisible() ? hideWindow() : showWindow());

const createTray = () => {
  tray = new Tray(path.join(__dirname, 'favicon.png'));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Quit', role: 'close', click: () => app.quit() }
  ]);
  tray.setToolTip('Signer');
  tray.on('double-click', toggleWindow);
  tray.on('right-click', () => {
    tray.popUpContextMenu(contextMenu);
  });
  tray.on('click', () => {
    toggleWindow();
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();
  createTray();
  showWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('browser-window-blur', (event, win) => {
  if (!win.webContents.isDevToolsFocused()) {
    hideWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

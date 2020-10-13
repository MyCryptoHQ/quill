import { app, BrowserWindow, Menu, screen, Tray } from 'electron';
import path from 'path';

import { runService as runCryptoService } from '@api/crypto';
import { runService as runDatabaseService } from '@api/db';
import { HEIGHT, WIDTH } from '@config';
import { getWindowPosition } from '@utils';

import { runAPI } from './api/ws';

declare const MAIN_WINDOW_WEBPACK_ENTRY: any;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: any;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line global-require
if (require('electron-squirrel-startup')) {
  app.quit();
}

let tray: Tray;
let window: BrowserWindow;

const createWindow = (): void => {
  // Create the browser window.
  window = new BrowserWindow({
    backgroundColor: '#fbfbfb',
    icon: path.join(__dirname, 'icon.png'),
    width: WIDTH,
    height: HEIGHT,
    fullscreenable: false,
    resizable: false,
    // Spectron fails randomly when the app is frameless
    // We don't use NODE_ENV as it is controlled by electron-forge
    frame: process.env.IS_TEST === 'true',
    transparent: true,
    webPreferences: {
      devTools: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      // For security reasons the following params should not be modified
      // https://electronjs.org/docs/tutorial/security#isolation-for-untrusted-content
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // and load the index.html of the app.
  window.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Run API
  runAPI(window.webContents);

  // Run Signing Logic
  runCryptoService();

  // Run Database Service
  runDatabaseService();
};

const showWindow = () => {
  const trayBounds = tray.getBounds();
  console.log(trayBounds);
  const trayScreen = screen.getDisplayNearestPoint({
    x: trayBounds.x,
    y: trayBounds.y
  });
  console.log(trayScreen);
  const position = getWindowPosition(trayBounds, trayScreen);
  window.setPosition(position.x, position.y, false);
  // Added because setPosition would sometimes squeeze the sizing
  window.setSize(WIDTH, HEIGHT, false);
  window.show();
  window.focus();
};

const toggleWindow = () => (window.isVisible() ? window.hide() : showWindow());

const createTray = () => {
  tray = new Tray(path.join(__dirname, 'favicon.png'));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Quit', role: 'close', click: () => app.quit() }
  ]);
  tray.setToolTip('Signer');
  tray.on('double-click', toggleWindow);
  tray.on('right-click', (e) => {
    e.preventDefault();
    tray.popUpContextMenu(contextMenu);
  });
  tray.on('click', (e) => {
    e.preventDefault();
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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

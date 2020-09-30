import { app, BrowserWindow, screen, Tray } from 'electron';
import path from 'path';

import { runService as runSigningService } from '@api/sign';

import { runAPI } from './api/ws';

declare const MAIN_WINDOW_WEBPACK_ENTRY: any;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: any;

const HEIGHT = 450;
const WIDTH = 300;

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

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();

  // Run API
  runAPI(window.webContents);

  // Run Signing Logic
  runSigningService();
};

// Based on https://cdruc.com/positioning-electron-tray-apps-on-windows-taskbar/
const getWindowPosition = () => {
  const trayBounds = tray.getBounds();

  // There may be more than one screen, so we need to figure out on which screen our tray icon lives.
  const trayScreen = screen.getDisplayNearestPoint({
    x: trayBounds.x,
    y: trayBounds.y
  });

  // Now that we know the display, we can grab its bounds and its workspace area.
  const { workArea } = trayScreen;
  const screenBounds = trayScreen.bounds;

  // TASKBAR LEFT
  if (workArea.x > 0) {
    // The workspace starts more on the right
    return {
      x: workArea.x,
      y: workArea.height - HEIGHT
    };
  }

  // TASKBAR TOP
  if (workArea.y > 0) {
    return {
      x: Math.round(trayBounds.x + trayBounds.width / 2 - WIDTH / 2),
      y: trayBounds.height
    };
  }

  // TASKBAR RIGHT
  // Here both workArea.y and workArea.x are 0 so we can no longer leverage them. We can use the workarea and display width though.
  if (workArea.width < screenBounds.width) {
    // The taskbar is either on the left or right, but since the LEFT case was handled above, we can be sure we're dealing with a right taskbar
    return {
      x: workArea.width - WIDTH,
      y: screenBounds.height - HEIGHT
    };
  }

  // TASKBAR BOTTOM
  // Since all the other cases were handled, we can be sure we're dealing with a bottom taskbar
  return {
    x: Math.round(trayBounds.x + trayBounds.width / 2 - WIDTH / 2),
    y: workArea.height - HEIGHT
  };
};

const showWindow = () => {
  const position = getWindowPosition();
  window.setPosition(position.x, position.y, false);
  // Added because setPosition would sometimes squeeze the sizing
  window.setSize(WIDTH, HEIGHT, false);
  window.show();
  window.focus();
};

const toggleWindow = () => (window.isVisible() ? window.hide() : showWindow());

const createTray = () => {
  tray = new Tray(path.join(__dirname, 'favicon.png'));
  tray.on('right-click', toggleWindow);
  tray.on('double-click', toggleWindow);
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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

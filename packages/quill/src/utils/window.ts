import type { BrowserWindow } from 'electron';

export const showWindowOnTop = (window: BrowserWindow) => {
  window.setAlwaysOnTop(true);
  // Hack to show on current desktop - see: https://github.com/electron/electron/issues/5362
  window.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  window.show();
  window.focus();
  window.setVisibleOnAllWorkspaces(false);
  window.setAlwaysOnTop(false);
};

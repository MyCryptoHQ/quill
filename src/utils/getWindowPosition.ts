import { Display, Rectangle } from 'electron';

import { HEIGHT, WIDTH } from '@config';

// Based on https://cdruc.com/positioning-electron-tray-apps-on-windows-taskbar/
export const getWindowPosition = (
  trayBounds: Rectangle,
  trayScreen: Pick<Display, 'workArea' | 'bounds'>
) => {
  // Now that we know the display, we can grab its bounds and its workspace area.
  const { workArea, bounds: screenBounds } = trayScreen;

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

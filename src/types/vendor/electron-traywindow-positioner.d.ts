declare module 'electron-traywindow-positioner' {
  import type { Point, Rectangle } from 'electron';

  export function calculate(windowBounds: Rectangle, trayBounds: Rectangle): Point;
}

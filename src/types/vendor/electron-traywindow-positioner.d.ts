declare module 'electron-traywindow-positioner' {
  import { Point, Rectangle } from 'electron';

  export function calculate(windowBounds: Rectangle, trayBounds: Rectangle): Point;
}

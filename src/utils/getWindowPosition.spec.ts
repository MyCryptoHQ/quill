import { getWindowPosition } from './getWindowPosition';

describe('getWindowPosition', () => {
  it('positions correctly at the bottom', () => {
    const result = getWindowPosition(
      { x: 1713, y: 1040, width: 24, height: 40 },
      {
        workArea: { x: 0, y: 0, width: 1920, height: 1040 },
        bounds: { x: 0, y: 0, width: 1920, height: 1080 }
      }
    );
    expect(result).toStrictEqual({
      x: 1575,
      y: 590
    });
  });

  it('positions correctly at the top', () => {
    const result = getWindowPosition(
      { x: 1713, y: 0, width: 24, height: 40 },
      {
        workArea: { x: 0, y: 40, width: 1920, height: 1040 },
        bounds: { x: 0, y: 0, width: 1920, height: 1080 }
      }
    );
    expect(result).toStrictEqual({
      x: 1575,
      y: 40
    });
  });

  it('positions correctly at the left', () => {
    const result = getWindowPosition(
      { x: 33, y: 895, width: 24, height: 24 },
      {
        workArea: { x: 62, y: 0, width: 1858, height: 1080 },
        bounds: { x: 0, y: 0, width: 1920, height: 1080 }
      }
    );
    expect(result).toStrictEqual({
      x: 62,
      y: 630
    });
  });

  it('positions correctly at the right', () => {
    const result = getWindowPosition(
      { x: 1863, y: 919, width: 24, height: 40 },
      {
        workArea: { x: 0, y: 0, width: 1858, height: 1080 },
        bounds: { x: 0, y: 0, width: 1920, height: 1080 }
      }
    );
    expect(result).toStrictEqual({
      x: 1558,
      y: 630
    });
  });
});

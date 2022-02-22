import { hasCamera } from '@utils/camera';

describe('hasCamera', () => {
  it('returns false in mediaDevices is undefined', async () => {
    Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: undefined });

    await expect(hasCamera()).resolves.toBe(false);
  });

  it('returns false if there are no media devices', async () => {
    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: {
        enumerateDevices: jest.fn().mockResolvedValue([])
      }
    });

    await expect(hasCamera()).resolves.toBe(false);
  });

  it('returns true if there is at least one camera device', async () => {
    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: {
        enumerateDevices: jest.fn().mockResolvedValue([
          {
            kind: 'videoinput'
          }
        ])
      }
    });

    await expect(hasCamera()).resolves.toBe(true);
  });
});

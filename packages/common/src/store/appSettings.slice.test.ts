import slice, { setAutoLockTimeout } from './appSettings.slice';

describe('appSettings slice', () => {
  describe('setAutoLockTimeout', () => {
    it('sets autoLockTimeout', () => {
      expect(slice.reducer(undefined, setAutoLockTimeout(600000))).toStrictEqual(
        expect.objectContaining({
          autoLockTimeout: 600000
        })
      );
    });
  });
});

import slice, { setPersisted, setPersistor } from './persistence.slice';

describe('Persistence', () => {
  describe('setPersisted', () => {
    it('sets isPersisted to the payload', () => {
      expect(slice.reducer({ isPersisted: false }, setPersisted(true))).toStrictEqual({
        isPersisted: true
      });

      expect(slice.reducer({ isPersisted: true }, setPersisted(false))).toStrictEqual({
        isPersisted: false
      });
    });
  });

  describe('setPersistor', () => {
    it('sets persistor to the payload', () => {
      const persistor = {
        pause: jest.fn(),
        persist: jest.fn(),
        purge: jest.fn(),
        flush: jest.fn(),
        dispatch: jest.fn(),
        getState: jest.fn(),
        subscribe: jest.fn()
      };
      expect(
        slice.reducer({ isPersisted: false, persistor: undefined }, setPersistor(persistor))
      ).toStrictEqual({
        isPersisted: false,
        persistor
      });
    });
  });
});

import slice, { rehydrateState } from './persistence.slice';

describe('Persistence', () => {
  describe('rehydrateState', () => {
    it('adds the key to the rehydrated keys', () => {
      expect(
        slice.reducer({ rehydratedKeys: [] }, rehydrateState({ key: 'foo', state: 'bar' }))
      ).toStrictEqual({
        rehydratedKeys: ['foo']
      });
    });
  });
});

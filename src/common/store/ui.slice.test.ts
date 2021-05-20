import slice, { setNavigationBack } from './ui.slice';

describe('UI slice', () => {
  describe('setNavigationBack', () => {
    it('sets navigationBack', () => {
      expect(slice.reducer(undefined, setNavigationBack('/foo'))).toStrictEqual(
        expect.objectContaining({
          navigationBack: '/foo'
        })
      );
    });
  });
});

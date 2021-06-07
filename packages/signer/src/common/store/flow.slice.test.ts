import slice, { nextFlow, previousFlow, resetFlow } from '@common/store/flow.slice';

describe('FlowSlice', () => {
  describe('nextFlow', () => {
    it('increments the step by one', () => {
      expect(slice.reducer(0, nextFlow())).toBe(1);
    });
  });

  describe('previousFlow', () => {
    it('decrements the step by one', () => {
      expect(slice.reducer(1, previousFlow())).toBe(0);
    });
  });

  describe('resetFlow', () => {
    it('sets the step to zero', () => {
      expect(slice.reducer(2, resetFlow())).toBe(0);
    });
  });
});

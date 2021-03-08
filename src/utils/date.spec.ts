import { formatTimeDifference } from './date';

describe('formatTimeDifference', () => {
  it('formats time difference', () => {
    expect(formatTimeDifference(0, 1000)).toBe('less than 5 seconds ago');
    expect(formatTimeDifference(0, 100000)).toBe('2 minutes ago');
  });
});

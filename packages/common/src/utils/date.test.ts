import { formatTimeDifference } from './date';

describe('formatTimeDifference', () => {
  it('formats time difference', () => {
    expect(formatTimeDifference(0, 1000)).toBe('1 second ago');
    expect(formatTimeDifference(0, 100000)).toBe('2 minutes ago');
  });
});

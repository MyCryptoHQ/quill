import { formatTimeDifference, formatTimeDifferenceShort } from './date';

describe('formatTimeDifference', () => {
  it('formats time difference', () => {
    expect(formatTimeDifference(0, 1000)).toBe('1 second ago');
    expect(formatTimeDifference(0, 100000)).toBe('2 minutes ago');
  });
});

describe('formatTimeDifferenceShort', () => {
  it('formats time difference', () => {
    expect(formatTimeDifferenceShort(0, 1000)).toBe('1s ago');
    expect(formatTimeDifferenceShort(0, 100000)).toBe('2m ago');
    expect(formatTimeDifferenceShort(0, 10000000)).toBe('3h ago');
    expect(formatTimeDifferenceShort(0, 100000000)).toBe('1d ago');
    expect(formatTimeDifferenceShort(0, 10000000000)).toBe('4mo ago');
    expect(formatTimeDifferenceShort(0, 40000000000)).toBe('1y ago');
    expect(formatTimeDifferenceShort(0, 90000000000)).toBe('3y ago');
  });
});

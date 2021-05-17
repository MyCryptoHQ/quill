import { mockRandom } from 'jest-mock-random';

import { getRandomNumbers, shuffle } from './random';

describe('shuffle', () => {
  it('shuffles an array', () => {
    mockRandom([0.3, 0.2, 0.1]);

    const array = [1, 2, 3];
    expect(shuffle(array)).toStrictEqual([3, 2, 1]);
  });
});

describe('getRandomNumbers', () => {
  it('returns random unique numbers', () => {
    mockRandom([0.3, 0.2, 0.1]);

    expect(getRandomNumbers(24, 3)).toStrictEqual([2, 5, 8]);
  });
});

import { chunk } from '@utils/chunk';

describe('chunk', () => {
  it('chunks an array into the specified size', () => {
    const array = ['foo', 'bar', 'baz', 'qux', 'quux', 'corge', 'grault', 'garply'];

    expect(chunk(array, 2)).toStrictEqual([
      ['foo', 'bar'],
      ['baz', 'qux'],
      ['quux', 'corge'],
      ['grault', 'garply']
    ]);

    expect(chunk(array, 3)).toStrictEqual([
      ['foo', 'bar', 'baz'],
      ['qux', 'quux', 'corge'],
      ['grault', 'garply']
    ]);
  });
});

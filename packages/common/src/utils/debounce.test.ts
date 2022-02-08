import { keyDebounce } from './debounce';

jest.useFakeTimers();

describe('keyDebounce', () => {
  it('debounces a function', () => {
    const fn = jest.fn();
    const debounced = keyDebounce(fn);

    expect(debounced).toBeInstanceOf(Function);
    debounced('foo');
    debounced('foo');

    expect(fn).not.toHaveBeenCalled();
    jest.runAllTimers();
    expect(fn).toHaveBeenCalledWith('foo');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('uses the key for debouncing', () => {
    const fn = jest.fn();
    const debounced = keyDebounce(fn);

    expect(debounced).toBeInstanceOf(Function);
    debounced('foo');
    debounced('foo');
    debounced('bar');
    debounced('bar');

    expect(fn).not.toHaveBeenCalled();
    jest.runAllTimers();
    expect(fn).toHaveBeenCalledWith('foo');
    expect(fn).toHaveBeenCalledWith('bar');
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

import { renderHook } from '@testing-library/react-hooks';

import { useUnmount } from './useUnmount';

describe('useUnmount', () => {
  it('calls the provided function on unmount', () => {
    const fn = jest.fn();
    const { unmount } = renderHook(() => useUnmount(fn));

    unmount();

    expect(fn).toHaveBeenCalled();
  });
});

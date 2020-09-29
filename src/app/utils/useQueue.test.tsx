import { act, renderHook } from '@testing-library/react-hooks';

import { useQueue } from './useQueue';

describe('useQueue', () => {
  it('enqueue adds correctly to queue', () => {
    const { result } = renderHook(() => useQueue());
    act(() => {
      result.current.enqueue(1);
      result.current.enqueue(2);
      result.current.enqueue(3);
    });
    expect(result.current.first).toBe(1);
    expect(result.current).toHaveLength(3);
  });

  it('dequeue removes correctly from queue', () => {
    const { result } = renderHook(() => useQueue());
    act(() => {
      result.current.enqueue(1);
      result.current.enqueue(2);
      result.current.enqueue(3);
      result.current.dequeue();
    });
    expect(result.current.first).toBe(2);
    expect(result.current).toHaveLength(2);
  });
});

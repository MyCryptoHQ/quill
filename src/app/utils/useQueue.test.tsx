/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';

import { act, renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';

import { createStore } from '@app/store';

import { useQueue } from './useQueue';

const renderUseQueue = () => {
  const wrapper: React.FC = ({ children }) => <Provider store={createStore()}>{children}</Provider>;
  return renderHook(() => useQueue((state) => state.queue.queue), { wrapper });
};

describe('useQueue', () => {
  it('enqueue adds correctly to queue', () => {
    const { result } = renderUseQueue();
    act(() => {
      // @ts-ignore
      result.current.enqueue(1);
      // @ts-ignore
      result.current.enqueue(2);
      // @ts-ignore
      result.current.enqueue(3);
    });
    expect(result.current.first).toBe(1);
    expect(result.current).toHaveLength(3);
  });

  it('dequeue removes correctly from queue', () => {
    const { result } = renderUseQueue();
    act(() => {
      // @ts-ignore
      result.current.enqueue(1);
      // @ts-ignore
      result.current.enqueue(2);
      // @ts-ignore
      result.current.enqueue(3);
      result.current.dequeue();
    });
    expect(result.current.first).toBe(2);
    expect(result.current).toHaveLength(2);
  });
});

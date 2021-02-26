import React from 'react';

import { act, renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';

import { createStore } from '@app/store';
import { SUPPORTED_METHODS } from '@config';
import { JsonRPCRequest } from '@types';

import { useQueue } from './useQueue';

const renderUseQueue = () => {
  const wrapper: React.FC = ({ children }) => <Provider store={createStore()}>{children}</Provider>;
  return renderHook(() => useQueue((state) => state.transactions.queue), { wrapper });
};

const requests: JsonRPCRequest[] = [
  { id: 1, method: SUPPORTED_METHODS.SIGN_TRANSACTION, jsonrpc: '2.0', params: [] },
  { id: 2, method: SUPPORTED_METHODS.SIGN_TRANSACTION, jsonrpc: '2.0', params: [] },
  { id: 3, method: SUPPORTED_METHODS.SIGN_TRANSACTION, jsonrpc: '2.0', params: [] }
];

describe('useQueue', () => {
  it('enqueue adds correctly to queue', () => {
    const { result } = renderUseQueue();
    act(() => {
      result.current.enqueue(requests[0]);
      result.current.enqueue(requests[1]);
      result.current.enqueue(requests[2]);
    });
    expect(result.current.first).toBe(requests[0]);
    expect(result.current).toHaveLength(3);
  });

  it('dequeue removes correctly from queue', () => {
    const { result } = renderUseQueue();
    act(() => {
      result.current.enqueue(requests[0]);
      result.current.enqueue(requests[1]);
      result.current.enqueue(requests[2]);
      result.current.dequeue();
    });
    expect(result.current.first).toBe(requests[1]);
    expect(result.current).toHaveLength(2);
  });
});

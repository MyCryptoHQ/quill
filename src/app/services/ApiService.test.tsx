import React from 'react';

import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';

import { createStore } from '@app/store';
import { ipcBridgeRenderer } from '@bridge';
import { JsonRPCRequest } from '@types';

import { useApiService } from './ApiService';

jest.mock('@bridge', () => ({
  ipcBridgeRenderer: {
    api: {
      subscribeToRequests: (callback: (request: JsonRPCRequest) => void) => {
        callback({ id: 1, jsonrpc: '2.0', method: 'eth_signTransaction', params: [{}] });
        return () => true;
      },
      sendResponse: jest.fn()
    }
  }
}));

const renderUseApiService = () => {
  const wrapper: React.FC = ({ children }) => <Provider store={createStore()}>{children}</Provider>;
  return renderHook(() => useApiService(), { wrapper });
};

describe('ApiService', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('sends the correct response when user denies tx', () => {
    const { result } = renderUseApiService();
    result.current.denyCurrent();
    expect(ipcBridgeRenderer.api.sendResponse).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.objectContaining({ code: '-32000' }) })
    );
  });
});

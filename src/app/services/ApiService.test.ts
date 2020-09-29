import { ipcBridge } from '@bridge';
import { fTxResponse } from '@fixtures';
import { renderHook } from '@testing-library/react-hooks';

import { JsonRPCRequest } from '@types';

import { useApiService } from './ApiService';

jest.mock('@bridge', () => ({
  ipcBridge: {
    subscribeToRequests: (callback: (request: JsonRPCRequest) => void) => {
      callback({ id: 1, jsonrpc: '2.0', method: 'eth_signTransaction', params: [{}] });
      return () => true;
    },
    sendResponse: jest.fn()
  }
}));

describe('ApiService', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('sends the correct response when user approves tx', () => {
    const { result } = renderHook(() => useApiService());
    result.current.approveCurrent(fTxResponse);
    expect(ipcBridge.sendResponse).toHaveBeenCalledWith(
      expect.objectContaining({ result: fTxResponse })
    );
  });

  it('sends the correct response when user denies tx', () => {
    const { result } = renderHook(() => useApiService());
    result.current.denyCurrent();
    expect(ipcBridge.sendResponse).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.objectContaining({ code: '-32000' }) })
    );
  });
});

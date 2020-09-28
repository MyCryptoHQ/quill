import { waitFor } from '@testing-library/react';
import { IpcMain, WebContents } from 'electron';

import { IPC_CHANNELS, SUPPORTED_METHODS } from '@types';

import { handleRequest } from './api';

const mockIpcMain = { on: jest.fn() };
const mockWebContents = { send: jest.fn() };

describe('handleRequest', () => {
  it('fails with invalid json', async () => {
    const result = await handleRequest(
      '',
      (mockIpcMain as unknown) as IpcMain,
      (mockWebContents as unknown) as WebContents
    );
    expect(result).toStrictEqual(
      expect.objectContaining({ error: expect.objectContaining({ code: '-32700' }) })
    );
  });

  it('fails with invalid method', async () => {
    const request = { method: 'bla' };
    const result = await handleRequest(
      JSON.stringify(request),
      (mockIpcMain as unknown) as IpcMain,
      (mockWebContents as unknown) as WebContents
    );
    expect(result).toStrictEqual(
      expect.objectContaining({ error: expect.objectContaining({ code: '-32601' }) })
    );
  });

  it('fails with invalid request', async () => {
    const request = { method: SUPPORTED_METHODS.SIGN_TRANSACTION };
    const result = await handleRequest(
      JSON.stringify(request),
      (mockIpcMain as unknown) as IpcMain,
      (mockWebContents as unknown) as WebContents
    );
    expect(result).toStrictEqual(
      expect.objectContaining({ error: expect.objectContaining({ code: '-32600' }) })
    );
  });

  it('requests signing with valid request', async () => {
    const request = {
      id: 1,
      jsonrpc: '2.0',
      method: SUPPORTED_METHODS.SIGN_TRANSACTION,
      params: [
        {
          to: '0x',
          from: '0x',
          nonce: '0x1',
          gasLimit: '0x',
          gasPrice: '0x',
          data: '0x',
          value: '0x',
          chainId: 3
        }
      ]
    };
    handleRequest(
      JSON.stringify(request),
      (mockIpcMain as unknown) as IpcMain,
      (mockWebContents as unknown) as WebContents
    );
    await waitFor(() =>
      expect(mockWebContents.send).toHaveBeenCalledWith(IPC_CHANNELS.API, request)
    );
    expect(mockIpcMain.on).toHaveBeenCalled();
  });
});

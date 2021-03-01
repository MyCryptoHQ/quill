import { waitFor } from '@testing-library/react';
import { WebContents } from 'electron';

import { IPC_CHANNELS, SUPPORTED_METHODS } from '@config';
import { fTxResponse } from '@fixtures';

import { handleRequest } from './api';

jest.mock('electron', () => ({
  ipcMain: {
    on: jest.fn().mockImplementation((_channel, callback) => {
      callback(undefined, {
        id: 1,
        result: {
          nonce: 6,
          gasPrice: {
            _hex: '0x012a05f200'
          },
          gasLimit: {
            _hex: '0x5208'
          },
          to: '0xb2bb2b958AFa2e96dab3f3Ce7162b87daEa39017',
          value: {
            _hex: '0x2386f26fc10000'
          },
          data: '0x',
          chainId: 3,
          v: 42,
          r: '0x2bd827ea378f4856ff2ea5997f48ea63045da64bb09ce494c886c1934d29d627',
          s: '0x0af001168b5e8db5cc47ff1f985629ddad535b334060846facb8a7c43cf9c6f1',
          from: '0xb2bb2b958AFa2e96dab3f3Ce7162b87daEa39017',
          hash: '0x33d9b1b88cc48ca6da01310ab3acc86ae4cc2527bb3fc8662fd308cd63f303b1'
        }
      });
    })
  }
}));

jest.mock('./db', () => ({
  getFromStore: jest.fn().mockImplementation(() => {
    return Promise.resolve({
      accounts: [
        {
          uuid: '4be38596-5d9c-5c01-8e04-19d1c726fe24',
          address: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520'
        }
      ]
    });
  })
}));

const mockWebContents = { send: jest.fn() };

describe('handleRequest', () => {
  it('fails with invalid json', async () => {
    const result = await handleRequest('', (mockWebContents as unknown) as WebContents);
    expect(result).toStrictEqual(
      expect.objectContaining({ error: expect.objectContaining({ code: '-32700' }) })
    );
  });

  it('fails with invalid request', async () => {
    const request = { id: 0, jsonrpc: '1.0', method: 'bla' };
    const result = await handleRequest(
      JSON.stringify(request),
      (mockWebContents as unknown) as WebContents
    );
    expect(result).toStrictEqual(
      expect.objectContaining({ error: expect.objectContaining({ code: '-32600' }) })
    );
  });

  it('fails with invalid method', async () => {
    const request = { id: 0, jsonrpc: '2.0', method: 'bla' };
    const result = await handleRequest(
      JSON.stringify(request),
      (mockWebContents as unknown) as WebContents
    );
    expect(result).toStrictEqual(
      expect.objectContaining({ error: expect.objectContaining({ code: '-32601' }) })
    );
  });

  it('fails with request with no params', async () => {
    const request = { id: 0, jsonrpc: '2.0', method: SUPPORTED_METHODS.SIGN_TRANSACTION };
    const result = await handleRequest(
      JSON.stringify(request),
      (mockWebContents as unknown) as WebContents
    );
    expect(result).toStrictEqual(
      expect.objectContaining({ error: expect.objectContaining({ code: '-32602' }) })
    );
  });

  it('fails with request with invalid params', async () => {
    const request = {
      id: 1,
      jsonrpc: '2.0',
      method: SUPPORTED_METHODS.SIGN_TRANSACTION,
      params: [
        {
          to: '0x',
          from: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520',
          nonce: '0x1',
          gasLimit: '0x1',
          gasPrice: '0x1',
          data: '0x',
          value: '0x1',
          chainId: 3
        }
      ]
    };

    await expect(
      handleRequest(JSON.stringify(request), (mockWebContents as unknown) as WebContents)
    ).resolves.toStrictEqual(
      expect.objectContaining({ error: expect.objectContaining({ code: '-32602' }) })
    );
  });

  it('requests signing with valid request', async () => {
    const request = {
      id: 1,
      jsonrpc: '2.0',
      method: SUPPORTED_METHODS.SIGN_TRANSACTION,
      params: [
        {
          to: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520',
          from: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520',
          nonce: '0x1',
          gasLimit: '0x1',
          gasPrice: '0x1',
          data: '0x',
          value: '0x1',
          chainId: 3
        }
      ]
    };
    const promise = handleRequest(
      JSON.stringify(request),
      (mockWebContents as unknown) as WebContents
    );
    await waitFor(() =>
      expect(mockWebContents.send).toHaveBeenCalledWith(IPC_CHANNELS.API, request)
    );

    const result = await promise;
    expect(result).toStrictEqual({ id: 1, jsonrpc: '2.0', result: fTxResponse });
  });

  it('returns accounts with valid request', async () => {
    const request = {
      id: 1,
      jsonrpc: '2.0',
      method: SUPPORTED_METHODS.ACCOUNTS,
      params: [] as number[]
    };
    const promise = handleRequest(
      JSON.stringify(request),
      (mockWebContents as unknown) as WebContents
    );
    const result = await promise;
    expect(result).toStrictEqual({
      id: 1,
      jsonrpc: '2.0',
      result: expect.arrayContaining(['0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520'])
    });
  });
});

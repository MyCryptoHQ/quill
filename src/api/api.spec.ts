import { waitFor } from '@testing-library/react';
import configureStore from 'redux-mock-store';

import { SUPPORTED_METHODS } from '@config';
import { fAccounts, fRequestOrigin, fSignedTx } from '@fixtures';

import { addTransaction } from '../common/store';
import type { DeepPartial, JsonRPCRequest, TSignTransaction } from '../types';
import { handleRequest } from './api';
import type { ApplicationState } from './store';

jest.unmock('@bridge');

jest.mock('electron', () => ({
  ipcMain: {
    on: jest.fn().mockImplementation((_channel, callback) => {
      callback({
        id: 1,
        result:
          '0xf86b0685012a05f20082520894b2bb2b958afa2e96dab3f3ce7162b87daea39017872386f26fc10000802aa0686df061021262b4e75eb1608c8baaf043cca2b5ac68fb24420ede62d13a8a7fa035389237414433ac06a33d95c863b8221fe2c797a9c650c47a555255be0234f3'
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

const createMockStore = configureStore<DeepPartial<ApplicationState>>();

describe('handleRequest', () => {
  it('fails with invalid json', async () => {
    const result = await handleRequest(
      '',
      // @ts-expect-error Partial store
      createMockStore(),
      fRequestOrigin
    );
    expect(result).toStrictEqual(
      expect.objectContaining({ error: expect.objectContaining({ code: '-32700' }) })
    );
  });

  it('fails with invalid request', async () => {
    const request = { id: 0, jsonrpc: '1.0', method: 'bla' };
    const result = await handleRequest(
      JSON.stringify(request),
      // @ts-expect-error Partial store
      createMockStore(),
      fRequestOrigin
    );
    expect(result).toStrictEqual(
      expect.objectContaining({ error: expect.objectContaining({ code: '-32600' }) })
    );
  });

  it('fails with invalid method', async () => {
    const request = { id: 0, jsonrpc: '2.0', method: 'bla' };
    const result = await handleRequest(
      JSON.stringify(request),
      // @ts-expect-error Partial store
      createMockStore(),
      fRequestOrigin
    );
    expect(result).toStrictEqual(
      expect.objectContaining({ error: expect.objectContaining({ code: '-32601' }) })
    );
  });

  it('fails with request with no params', async () => {
    const request = { id: 0, jsonrpc: '2.0', method: SUPPORTED_METHODS.SIGN_TRANSACTION };
    const result = await handleRequest(
      JSON.stringify(request),
      // @ts-expect-error Partial store
      createMockStore(),
      fRequestOrigin
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
      handleRequest(
        JSON.stringify(request),
        // @ts-expect-error Partial store
        createMockStore(),
        fRequestOrigin
      )
    ).resolves.toStrictEqual(
      expect.objectContaining({ error: expect.objectContaining({ code: '-32602' }) })
    );
  });

  it('requests signing with valid request', async () => {
    const store = createMockStore();
    const request: JsonRPCRequest<TSignTransaction> = {
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
      // @ts-expect-error Partial store
      store,
      fRequestOrigin
    );

    await waitFor(() =>
      expect(store.getActions()).toContainEqual(addTransaction({ request, origin: fRequestOrigin }))
    );

    const result = await promise;
    expect(result).toStrictEqual({ id: 1, jsonrpc: '2.0', result: fSignedTx });
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
      // @ts-expect-error Partial store
      createMockStore({
        accounts: {
          accounts: fAccounts
        }
      }),
      fRequestOrigin
    );
    const result = await promise;
    expect(result).toStrictEqual({
      id: 1,
      jsonrpc: '2.0',
      result: expect.arrayContaining(['0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520'])
    });
  });
});

import type { IncomingMessage } from 'http';
import { expectSaga } from 'redux-saga-test-plan';
import type WebSocket from 'ws';

import { JsonRPCMethod } from '@config';
import { fAccount, fRequestOrigin, fSignedTx, fTxRequest } from '@fixtures';

import { createJsonRpcRequest } from './utils';
import {
  handleRequest,
  reply,
  requestAccounts,
  requestSignTransaction,
  validateRequest,
  waitForResponse
} from './ws.sagas';

jest.mock('electron');
jest.mock('electron-store');

describe('validateRequest', () => {
  it('returns an error for invalid JSON', () => {
    expect(validateRequest('')).toStrictEqual([
      expect.objectContaining({ error: expect.objectContaining({ code: '-32700' }) }),
      null
    ]);
  });

  it('returns an error for invalid requests', () => {
    const request = JSON.stringify({ id: 0, jsonrpc: '1.0', method: 'bla' });
    expect(validateRequest(request)).toStrictEqual([
      expect.objectContaining({ error: expect.objectContaining({ code: '-32600' }) }),
      null
    ]);
  });

  it('returns an error for unsupported methods', () => {
    const request = JSON.stringify({ id: 0, jsonrpc: '2.0', method: 'bla' });
    expect(validateRequest(request)).toStrictEqual([
      expect.objectContaining({ error: expect.objectContaining({ code: '-32601' }) }),
      null
    ]);
  });

  it('returns an error for invalid params', () => {
    const request = JSON.stringify({
      id: 0,
      jsonrpc: '2.0',
      method: JsonRPCMethod.SignTransaction
    });
    expect(validateRequest(request)).toStrictEqual([
      expect.objectContaining({ error: expect.objectContaining({ code: '-32602' }) }),
      null
    ]);

    const invalidParamsRequest = JSON.stringify({
      id: 0,
      jsonrpc: '2.0',
      method: JsonRPCMethod.SignTransaction,
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
    });
    expect(validateRequest(invalidParamsRequest)).toStrictEqual([
      expect.objectContaining({ error: expect.objectContaining({ code: '-32602' }) }),
      null
    ]);
  });

  it('returns the parsed JSON-RPC request for valid requests', () => {
    const request = {
      id: 1,
      jsonrpc: '2.0',
      method: JsonRPCMethod.SignTransaction,
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

    expect(validateRequest(JSON.stringify(request))).toStrictEqual([null, request]);
  });
});

describe('waitForResponse', () => {
  it('returns the payload if the request ID matches', async () => {
    await expectSaga(waitForResponse, 1)
      .take(reply)
      .dispatch(reply({ id: 1, result: 'foo' }))
      .returns({ id: 1, result: 'foo' })
      .silentRun();

    await expectSaga(waitForResponse, 1)
      .take(reply)
      .dispatch(reply({ id: 2, result: 'foo' }))
      .not.returns({ id: 1, result: 'foo' })
      .silentRun();
  });
});

describe('handleRequest', () => {
  const socket = ({
    send: jest.fn()
  } as unknown) as WebSocket;

  const request = ({
    headers: {
      origin: 'https://app.mycrypto.com/foo'
    }
  } as unknown) as IncomingMessage;

  it('sends an error on invalid request', async () => {
    await expectSaga(handleRequest, { socket, request, data: '' }).silentRun();

    expect(socket.send).toHaveBeenCalledWith(
      JSON.stringify({
        jsonrpc: '2.0',
        id: null,
        error: { code: '-32700', message: 'Parse error' }
      })
    );
  });

  it('puts a method request and sends the result', async () => {
    const { params: _, ...accountsRequest } = createJsonRpcRequest(JsonRPCMethod.Accounts);
    await expectSaga(handleRequest, { socket, request, data: JSON.stringify(accountsRequest) })
      .put(requestAccounts({ origin: fRequestOrigin, request: accountsRequest }))
      .call(waitForResponse, accountsRequest.id)
      .dispatch(
        reply({
          id: accountsRequest.id,
          result: [fAccount.address]
        })
      )
      .silentRun();

    expect(socket.send).toHaveBeenCalledWith(
      JSON.stringify({
        jsonrpc: '2.0',
        id: accountsRequest.id,
        result: [fAccount.address]
      })
    );

    await expectSaga(handleRequest, { socket, request, data: JSON.stringify(fTxRequest) })
      .put(requestSignTransaction({ origin: fRequestOrigin, request: fTxRequest }))
      .call(waitForResponse, fTxRequest.id)
      .dispatch(
        reply({
          id: fTxRequest.id,
          result: fSignedTx
        })
      )
      .silentRun();

    expect(socket.send).toHaveBeenCalledWith(
      JSON.stringify({
        jsonrpc: '2.0',
        id: fTxRequest.id,
        result: fSignedTx
      })
    );
  });
});

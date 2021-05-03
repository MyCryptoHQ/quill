import type { IncomingMessage } from 'http';
import { expectSaga } from 'redux-saga-test-plan';
import WebSocket from 'ws';

import { denyPermission, grantPermission, requestPermission } from '@common/store';
import { JsonRPCMethod } from '@config';
import {
  fAccount,
  fRequestOrigin,
  fRequestPrivateKey,
  fRequestPublicKey,
  fSignedTx,
  fTxRequest
} from '@fixtures';

import { createJsonRpcRequest, createSignedJsonRpcRequest } from './utils';
import {
  createWebSocketServer,
  handleRequest,
  requestWatcherWorker,
  validateRequest,
  waitForPermissions,
  waitForResponse
} from './ws.sagas';
import { reply, requestAccounts, requestSignTransaction } from './ws.slice';

jest.mock('electron');
jest.mock('electron-store');
jest.mock('ws');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('validateRequest', () => {
  it('returns an error for invalid JSON', () => {
    expect(validateRequest('')).toStrictEqual([
      expect.objectContaining({ error: expect.objectContaining({ code: '-32700' }) }),
      null
    ]);
  });

  it('returns an error for invalid requests', () => {
    const request = JSON.stringify({
      id: 0,
      jsonrpc: '1.0',
      method: 'bla',
      signature: '',
      publicKey: fRequestPublicKey
    });
    expect(validateRequest(request)).toStrictEqual([
      expect.objectContaining({ error: expect.objectContaining({ code: '-32600' }) }),
      null
    ]);
  });

  it('returns an error for unsupported methods', () => {
    const request = JSON.stringify({
      id: 0,
      jsonrpc: '2.0',
      method: 'bla',
      signature: '',
      publicKey: fRequestPublicKey
    });
    expect(validateRequest(request)).toStrictEqual([
      expect.objectContaining({ error: expect.objectContaining({ code: '-32601' }) }),
      null
    ]);
  });

  it('returns an error for invalid params', () => {
    const request = JSON.stringify({
      id: 0,
      jsonrpc: '2.0',
      method: JsonRPCMethod.SignTransaction,
      signature: '',
      publicKey: fRequestPublicKey
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
      ],
      signature: '',
      publicKey: fRequestPublicKey
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
      ],
      signature: '',
      publicKey: fRequestPublicKey
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
      .dispatch(reply({ id: 2, result: 'bar' }))
      .not.returns({ id: 2, result: 'bar' })
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
    const signedRequest = await createSignedJsonRpcRequest(
      fRequestPrivateKey,
      fRequestPublicKey,
      accountsRequest
    );
    await expectSaga(handleRequest, { socket, request, data: JSON.stringify(signedRequest) })
      .withState({
        permissions: { permissions: [{ origin: fRequestOrigin, publicKey: fRequestPublicKey }] }
      })
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

    const signedTxRequest = await createSignedJsonRpcRequest(
      fRequestPrivateKey,
      fRequestPublicKey,
      fTxRequest
    );
    await expectSaga(handleRequest, { socket, request, data: JSON.stringify(signedTxRequest) })
      .withState({
        permissions: { permissions: [{ origin: fRequestOrigin, publicKey: fRequestPublicKey }] }
      })
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

  it('waits for permissions if none exist', async () => {
    const { params: _, ...accountsRequest } = createJsonRpcRequest(JsonRPCMethod.Accounts);
    const signedRequest = await createSignedJsonRpcRequest(
      fRequestPrivateKey,
      fRequestPublicKey,
      accountsRequest
    );
    const permission = { origin: fRequestOrigin, publicKey: fRequestPublicKey };
    await expectSaga(handleRequest, { socket, request, data: JSON.stringify(signedRequest) })
      .withState({
        permissions: { permissions: [] }
      })
      .put(requestPermission(permission))
      .call(waitForPermissions, permission)
      .silentRun();
  });

  it('doesnt allow request if permissions denied', async () => {
    const { params: _, ...accountsRequest } = createJsonRpcRequest(JsonRPCMethod.Accounts);
    const signedRequest = await createSignedJsonRpcRequest(
      fRequestPrivateKey,
      fRequestPublicKey,
      accountsRequest
    );
    const permission = { origin: fRequestOrigin, publicKey: fRequestPublicKey };
    await expectSaga(handleRequest, { socket, request, data: JSON.stringify(signedRequest) })
      .withState({
        permissions: { permissions: [] }
      })
      .put(requestPermission(permission))
      .call(waitForPermissions, permission)
      .dispatch(denyPermission(permission))
      .not.put(
        reply({
          id: accountsRequest.id,
          result: [fAccount.address]
        })
      )
      .silentRun();
  });

  it('allows request if permissions approved', async () => {
    const { params: _, ...accountsRequest } = createJsonRpcRequest(JsonRPCMethod.Accounts);
    const signedRequest = await createSignedJsonRpcRequest(
      fRequestPrivateKey,
      fRequestPublicKey,
      accountsRequest
    );
    const permission = { origin: fRequestOrigin, publicKey: fRequestPublicKey };
    await expectSaga(handleRequest, { socket, request, data: JSON.stringify(signedRequest) })
      .withState({
        permissions: { permissions: [] }
      })
      .put(requestPermission(permission))
      .call(waitForPermissions, permission)
      .dispatch(grantPermission(permission))
      .put(requestAccounts({ origin: fRequestOrigin, request: accountsRequest }))
      .silentRun();
  });
});

describe('createWebSocketServer', () => {
  it('closes the connection when the channel is closed', () => {
    const channel = createWebSocketServer();
    channel.close();

    const server = WebSocket.Server as jest.MockedClass<typeof WebSocket.Server>;
    const instance = server.mock.instances[0];

    expect(instance.close).toHaveBeenCalled();
  });
});

describe('requestWatcherWorker', () => {
  it('handles socket requests', async () => {
    const server = WebSocket.Server as jest.MockedClass<typeof WebSocket.Server>;
    const saga = expectSaga(requestWatcherWorker);
    const promise = saga.silentRun();

    const socket = {
      send: jest.fn(),
      on: jest.fn()
    };

    const request = {
      origin: `https://${fRequestOrigin}/foo`
    };

    // The request watcher initialises the websocket server, which is callback based. Using some
    // Jest magic, we get the WebSocket server instance and get the callback function specified in
    // the `createWebSocketServer` function here.
    const instance = server.mock.instances[0];
    const on = instance.on as jest.MockedFunction<typeof instance.on>;
    const connectionCallback = on.mock.calls[0][1];

    // This simulates a callback of an incoming socket connection. This will register a callback for
    // new messages coming in from that socket.
    connectionCallback.bind(instance)(socket, request);

    // Here we get the socket message callback function and call that using a eth_signTransaction
    // request. This calls the redux-saga `eventChannel` emitter with the socket and request data.
    const messageCallback = socket.on.mock.calls[0][1];

    messageCallback(fTxRequest);

    // `handleRequest` should be called for any messages emitted from the `eventChannel`, so we can
    // test that here using `redux-saga-test-plan`.
    saga.fork(handleRequest, {
      socket,
      request,
      data: fTxRequest
    });

    await promise;
  });
});

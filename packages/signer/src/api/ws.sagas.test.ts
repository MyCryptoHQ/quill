import type { JsonRPCRequest } from '@signer/common';
import {
  denyPermission,
  grantPermission,
  incrementNonce,
  JsonRPCMethod,
  requestPermission
} from '@signer/common';
import type { IncomingMessage } from 'http';
import { expectSaga } from 'redux-saga-test-plan';
import WebSocket from 'ws';

import {
  fAccount,
  fRequestOrigin,
  fRequestPrivateKey,
  fRequestPublicKey,
  fSignedTx,
  fTxRequest
} from '@fixtures';
import { createJsonRpcRequest, createSignedJsonRpcRequest } from '@utils';

import {
  createWebSocketServer,
  handleRequest,
  requestWatcherWorker,
  validateRequest,
  verifyRequestNonce,
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

  it('returns an error for invalid requests', async () => {
    const request = {
      id: 0,
      jsonrpc: '1.0',
      method: 'bla'
    };

    const signedRequest = await createSignedJsonRpcRequest(
      fRequestPrivateKey,
      fRequestPublicKey,
      request as JsonRPCRequest
    );

    expect(validateRequest(JSON.stringify(signedRequest))).toStrictEqual([
      expect.objectContaining({ error: expect.objectContaining({ code: '-32600' }) }),
      null
    ]);
  });

  it('returns an error for unsupported methods', async () => {
    const request = {
      id: 0,
      jsonrpc: '2.0' as const,
      method: 'bla'
    };

    const signedRequest = await createSignedJsonRpcRequest(
      fRequestPrivateKey,
      fRequestPublicKey,
      request
    );

    expect(validateRequest(JSON.stringify(signedRequest))).toStrictEqual([
      expect.objectContaining({ error: expect.objectContaining({ code: '-32601' }) }),
      null
    ]);
  });

  it('returns an error for invalid params', async () => {
    const request = {
      id: 0,
      jsonrpc: '2.0' as const,
      method: JsonRPCMethod.SignTransaction
    };

    const signedRequest = await createSignedJsonRpcRequest(
      fRequestPrivateKey,
      fRequestPublicKey,
      request
    );

    expect(validateRequest(JSON.stringify(signedRequest))).toStrictEqual([
      expect.objectContaining({ error: expect.objectContaining({ code: '-32602' }) }),
      null
    ]);

    const invalidParamsRequest = {
      id: 0,
      jsonrpc: '2.0' as const,
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
    };

    const signedInvalidParamsRequest = await createSignedJsonRpcRequest(
      fRequestPrivateKey,
      fRequestPublicKey,
      invalidParamsRequest
    );

    expect(validateRequest(JSON.stringify(signedInvalidParamsRequest))).toStrictEqual([
      expect.objectContaining({ error: expect.objectContaining({ code: '-32602' }) }),
      null
    ]);
  });

  it('returns the parsed JSON-RPC request for valid requests', async () => {
    const request = {
      id: 1,
      jsonrpc: '2.0' as const,
      method: JsonRPCMethod.SignTransaction,
      params: [
        {
          to: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520',
          from: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520',
          nonce: '0x1',
          gas: '0x1',
          gasPrice: '0x1',
          data: '0x',
          value: '0x1',
          chainId: 3
        }
      ]
    };
    const signedRequest = await createSignedJsonRpcRequest(
      fRequestPrivateKey,
      fRequestPublicKey,
      request
    );

    expect(validateRequest(JSON.stringify(signedRequest))).toStrictEqual([null, signedRequest]);
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

describe('verifyRequestNonce', () => {
  it('checks and increments the request nonce', async () => {
    const request = createJsonRpcRequest(JsonRPCMethod.Accounts);

    await expectSaga(verifyRequestNonce, request, fRequestPublicKey)
      .withState({
        ws: {
          nonces: {
            [fRequestPublicKey]: 0
          }
        }
      })
      .put(incrementNonce(fRequestPublicKey))
      .returns(true)
      .silentRun();

    await expectSaga(verifyRequestNonce, { ...request, id: 1 }, fRequestPublicKey)
      .withState({
        ws: {
          nonces: {
            [fRequestPublicKey]: 1
          }
        }
      })
      .put(incrementNonce(fRequestPublicKey))
      .returns(true)
      .silentRun();
  });

  it('returns false for invalid nonces', async () => {
    const request = createJsonRpcRequest(JsonRPCMethod.Accounts);

    await expectSaga(verifyRequestNonce, request, fRequestPublicKey)
      .withState({
        ws: {
          nonces: {
            [fRequestPublicKey]: 1
          }
        }
      })
      .not.put(incrementNonce(fRequestPublicKey))
      .returns(false)
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
        permissions: { permissions: [{ origin: fRequestOrigin, publicKey: fRequestPublicKey }] },
        ws: {
          nonces: {
            [fRequestPublicKey]: 0
          }
        },
        auth: {
          loggedIn: true
        }
      })
      .put(requestAccounts({ origin: fRequestOrigin, request: accountsRequest }))
      .call(waitForResponse, accountsRequest.id)
      .dispatch(
        reply({
          id: 0,
          result: [fAccount.address]
        })
      )
      .silentRun();

    expect(socket.send).toHaveBeenCalledWith(
      JSON.stringify({
        jsonrpc: '2.0',
        id: 0,
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
        permissions: { permissions: [{ origin: fRequestOrigin, publicKey: fRequestPublicKey }] },
        ws: {
          nonces: {
            [fRequestPublicKey]: 0
          }
        },
        auth: {
          loggedIn: true
        }
      })
      .put(requestSignTransaction({ origin: fRequestOrigin, request: fTxRequest }))
      .call(waitForResponse, 0)
      .dispatch(
        reply({
          id: 0,
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
        permissions: { permissions: [] },
        ws: {
          nonces: {
            [fRequestPublicKey]: 0
          }
        },
        auth: {
          loggedIn: true
        }
      })
      .put(requestPermission(permission))
      .call(waitForPermissions, permission)
      .silentRun();
  });

  it("doesn't allow request if permissions denied", async () => {
    const { params: _, ...accountsRequest } = createJsonRpcRequest(JsonRPCMethod.Accounts);
    const signedRequest = await createSignedJsonRpcRequest(
      fRequestPrivateKey,
      fRequestPublicKey,
      accountsRequest
    );
    const permission = { origin: fRequestOrigin, publicKey: fRequestPublicKey };
    await expectSaga(handleRequest, { socket, request, data: JSON.stringify(signedRequest) })
      .withState({
        permissions: { permissions: [] },
        ws: {
          nonces: {
            [fRequestPublicKey]: 0
          }
        },
        auth: {
          loggedIn: true
        }
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

  it("doesn't allow request if the nonce is invalid", async () => {
    const { params: _, ...accountsRequest } = createJsonRpcRequest(JsonRPCMethod.Accounts);
    const signedRequest = await createSignedJsonRpcRequest(
      fRequestPrivateKey,
      fRequestPublicKey,
      accountsRequest
    );

    await expectSaga(handleRequest, { socket, request, data: JSON.stringify(signedRequest) })
      .withState({
        permissions: { permissions: [{ origin: fRequestOrigin, publicKey: fRequestPublicKey }] },
        ws: {
          nonces: {
            [fRequestPublicKey]: 1
          }
        },
        auth: {
          loggedIn: true
        }
      })
      .not.put(requestAccounts({ origin: fRequestOrigin, request: accountsRequest }))
      .silentRun();

    expect(socket.send).toHaveBeenCalledWith(
      JSON.stringify({
        jsonrpc: '2.0',
        id: 0,
        error: {
          code: '-32600',
          message: 'Invalid request nonce',
          data: {
            expectedNonce: 1
          }
        }
      })
    );
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
        permissions: { permissions: [] },
        ws: {
          nonces: {
            [fRequestPublicKey]: 0
          }
        },
        auth: {
          loggedIn: true
        }
      })
      .put(requestPermission(permission))
      .call(waitForPermissions, permission)
      .dispatch(grantPermission(permission))
      .put(requestAccounts({ origin: fRequestOrigin, request: accountsRequest }))
      .silentRun();
  });

  it('returns an error if origin is missing', async () => {
    const { params: _, ...accountsRequest } = createJsonRpcRequest(JsonRPCMethod.Accounts, 3);
    const signedRequest = await createSignedJsonRpcRequest(
      fRequestPrivateKey,
      fRequestPublicKey,
      accountsRequest
    );

    await expectSaga(handleRequest, {
      socket,
      request: {} as IncomingMessage,
      data: JSON.stringify(signedRequest)
    })
      .withState({
        auth: {
          loggedIn: true
        }
      })
      .silentRun();

    expect(socket.send).toHaveBeenCalledWith(
      JSON.stringify({
        jsonrpc: '2.0',
        id: 3,
        error: { code: '-32600', message: 'Invalid request' }
      })
    );
  });

  it('returns an error if signature is invalid', async () => {
    const { params: _, ...accountsRequest } = createJsonRpcRequest(JsonRPCMethod.Accounts, 1);

    const { signature } = await createSignedJsonRpcRequest(fRequestPrivateKey, fRequestPublicKey, {
      ...accountsRequest,
      id: 42
    });

    const invalidSignedRequest = { ...accountsRequest, publicKey: fRequestPublicKey, signature };

    await expectSaga(handleRequest, {
      socket,
      request,
      data: JSON.stringify(invalidSignedRequest)
    })
      .withState({
        auth: {
          loggedIn: true
        }
      })
      .silentRun();

    expect(socket.send).toHaveBeenCalledWith(
      JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        error: { code: '-32600', message: 'Invalid request' }
      })
    );
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

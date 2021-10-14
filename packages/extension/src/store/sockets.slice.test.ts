import { signJsonRpcRequest } from '@quill/common';
import stringify from 'fast-json-stable-stringify';
import { chrome } from 'jest-chrome';
import { WebSocket } from 'mock-socket';
import { expectSaga } from 'redux-saga-test-plan';
import { call } from 'redux-saga-test-plan/matchers';

import { RelayTarget } from '../types';
import { createRandomPrivateKey } from '../utils';
import { fSignedTx } from './__fixtures__/transaction';
import { broadcastTransaction } from './jsonrpc.slice';
import slice, {
  createConnection,
  createConnectionChannel,
  createPrivateKeyWorker,
  handleRequest,
  handleRequestWorker,
  handleResponseWorker,
  incrementNonce,
  message,
  send,
  setConnected,
  setNonce,
  setPrivateKey,
  socketRequestWorker,
  socketWorker,
  waitForResponse
} from './sockets.slice';

jest.mock('mock-socket');
global.WebSocket = WebSocket;

const PRIVATE_KEY = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('SocketsSlice', () => {
  describe('setPrivateKey', () => {
    it('sets the private key', () => {
      expect(slice.reducer(undefined, setPrivateKey('foo')).privateKey).toBe('foo');
    });
  });

  describe('setConnected', () => {
    it('sets the connection status', () => {
      expect(slice.reducer(undefined, setConnected(true)).isConnected).toBe(true);
      expect(slice.reducer(undefined, setConnected(false)).isConnected).toBe(false);
    });
  });

  describe('incrementNonce', () => {
    it('increments the nonce by one', () => {
      expect(slice.reducer(undefined, incrementNonce()).nonce).toBe(1);
    });
  });

  describe('setNonce', () => {
    it('sets the nonce', () => {
      expect(slice.reducer(undefined, setNonce(2)).nonce).toBe(2);
    });
  });
});

describe('createPrivateKeyWorker', () => {
  it('creates a random private key', async () => {
    await expectSaga(createPrivateKeyWorker)
      .provide([[call.fn(createRandomPrivateKey), 'foo']])
      .call(createRandomPrivateKey)
      .put(setPrivateKey('foo'))
      .silentRun();
  });
});

describe('waitForResponse', () => {
  it('waits for a valid response with a specific ID', async () => {
    await expectSaga(waitForResponse, 'foo')
      .dispatch(message({ jsonrpc: '2.0', id: 'bar', result: 'baz' }))
      .not.returns({ jsonrpc: '2.0', id: 'bar', result: 'baz' })
      .dispatch(message({ jsonrpc: '2.0', id: 'foo', result: 'baz' }))
      .returns({ jsonrpc: '2.0', id: 'bar', result: 'baz' })
      .silentRun();
  });
});

describe('handleRequestWorker', () => {
  it('sends a request to Quill and sends the response back to the extension', async () => {
    const request = {
      jsonrpc: '2.0' as const,
      id: 'foo',
      method: 'eth_accounts',
      params: []
    };

    await expectSaga(
      handleRequestWorker,
      handleRequest({
        request,
        tabId: 0
      })
    )
      .withState({
        sockets: {
          nonce: 0
        }
      })
      .put(send({ ...request, id: 0 }))
      .call(waitForResponse, 0)
      .dispatch(message({ jsonrpc: '2.0', id: 0, result: 'bar' }))
      .silentRun();

    expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(0, {
      id: 0,
      target: RelayTarget.Content,
      data: 'bar'
    });
  });

  it('retries with the correct nonce if the nonce is invalid', async () => {
    const request = {
      jsonrpc: '2.0' as const,
      id: 'foo',
      method: 'eth_accounts',
      params: []
    };

    await expectSaga(
      handleRequestWorker,
      handleRequest({
        request,
        tabId: 0
      })
    )
      .withState({
        sockets: {
          nonce: 0
        }
      })
      .put(send({ ...request, id: 0 }))
      .call(waitForResponse, 0)
      .dispatch(
        message({
          jsonrpc: '2.0',
          id: 0,
          error: {
            code: '-32600',
            message: 'Invalid request nonce',
            data: {
              expectedNonce: 5
            }
          }
        })
      )
      .put(setNonce(5))
      .call(handleRequestWorker, handleRequest({ request, tabId: 0 }), true)
      .returns('@@redux-saga/TASK_CANCEL')
      .silentRun();
  });

  it('does not retry if retryNonce is set', async () => {
    const request = {
      jsonrpc: '2.0' as const,
      id: 'foo',
      method: 'eth_accounts',
      params: []
    };

    await expectSaga(
      handleRequestWorker,
      handleRequest({
        request,
        tabId: 0
      }),
      true
    )
      .withState({
        sockets: {
          nonce: 0
        }
      })
      .put(send({ ...request, id: 0 }))
      .call(waitForResponse, 0)
      .dispatch(
        message({
          jsonrpc: '2.0',
          id: 0,
          error: {
            code: '-32600',
            message: 'Invalid request nonce',
            data: {
              expectedNonce: 5
            }
          }
        })
      )
      .not.put(setNonce(5))
      .not.call(handleRequestWorker, handleRequest({ request, tabId: 0 }), true)
      .silentRun();
  });
});

describe('handleResponseWorker', () => {
  const request = {
    jsonrpc: '2.0' as const,
    id: 1,
    method: 'eth_sendTransaction',
    params: [
      {
        nonce: '0x6',
        gasPrice: '0x012a05f200',
        gasLimit: '0x5208',
        from: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520',
        to: '0xb2bb2b958AFa2e96dab3f3Ce7162b87daEa39017',
        value: '0x2386f26fc10000',
        data: '0x',
        chainId: 3
      }
    ]
  };

  it('handles JSON-RPC responses from Quill', async () => {
    await expectSaga(handleResponseWorker, {
      request,
      response: {
        jsonrpc: '2.0',
        id: request.id,
        result: fSignedTx
      }
    })
      .put(broadcastTransaction(fSignedTx))
      .silentRun();
  });

  it('ignores error responses', async () => {
    await expectSaga(handleResponseWorker, {
      request,
      response: {
        jsonrpc: '2.0',
        id: request.id,
        result: '0x',
        error: {
          message: 'foo',
          code: '-1'
        }
      }
    })
      .not.put(broadcastTransaction('0xf000'))
      .silentRun();
  });
});

describe('socketRequestWorker', () => {
  it('sends signed requests when send is dispatched', async () => {
    const message = { jsonrpc: '2.0' as const, id: 'foo', method: 'eth_accounts', params: [] };

    const sendFn = jest.fn();
    await expectSaga(socketRequestWorker, ({ send: sendFn } as unknown) as WebSocket)
      .withState({
        sockets: {
          privateKey: PRIVATE_KEY
        }
      })
      .dispatch(send(message))
      .call(signJsonRpcRequest, PRIVATE_KEY, message)
      .silentRun();

    expect(sendFn).toHaveBeenCalledWith(
      stringify({
        ...message,
        publicKey: 'e734ea6c2b6257de72355e472aa05a4c487e6b463c029ed306df2f01b5636b58',
        signature:
          'b1e4edcf6a6cb9d5e83dbd1b4a4a30e8a6bdac0bcc19f4bf098614f59c9968fbec161679af5b8f5938cf2a2643bf24238576c95c262be262ce01d9bfbc21fc0b'
      })
    );
  });
});

describe('socketWorker', () => {
  it('creates a WebSocket connection and handles messages', async () => {
    const saga = await expectSaga(socketWorker);
    const promise = saga.silentRun();

    const mock = WebSocket as jest.MockedClass<typeof WebSocket>;
    const instance = mock.mock.instances[0];
    const addEventListener = instance.addEventListener as jest.MockedFunction<
      typeof instance.addEventListener
    >;

    const callback = addEventListener.mock.calls[0][1] as (event: MessageEvent) => void;

    saga
      .call(createConnection)
      .call(createConnectionChannel, instance)
      .put(setConnected(true))
      .fork(socketRequestWorker, instance);

    callback({ data: JSON.stringify({ foo: 'bar' }) } as MessageEvent);

    saga.put(message({ foo: 'bar' }));

    await promise;
  });

  it('reconnects if the connection is closed', async () => {
    const saga = await expectSaga(socketWorker);
    const promise = saga.silentRun();

    const mock = WebSocket as jest.MockedClass<typeof WebSocket>;
    const instance = mock.mock.instances[0];
    const addEventListener = instance.addEventListener as jest.MockedFunction<
      typeof instance.addEventListener
    >;

    const callback = addEventListener.mock.calls[2][1] as () => void;

    callback();

    saga.spawn(socketWorker, 5000);

    await promise;
  });

  it('reconnects on error', async () => {
    const saga = await expectSaga(socketWorker);
    const promise = saga.silentRun();

    const mock = WebSocket as jest.MockedClass<typeof WebSocket>;
    const instance = mock.mock.instances[0];
    const addEventListener = instance.addEventListener as jest.MockedFunction<
      typeof instance.addEventListener
    >;

    const callback = addEventListener.mock.calls[1][1] as () => void;

    callback();

    saga.spawn(socketWorker, 5000);

    await promise;
  });

  it('delays if a delay is specified', async () => {
    await expectSaga(socketWorker, 1000).delay(1000).silentRun();
  });
});

// @todo: Currently not supported by `jest-chrome`
// https://github.com/extend-chrome/jest-chrome/issues/11
describe('setConnectedWorker', () => {
  // eslint-disable-next-line jest/no-commented-out-tests
  // it('sets a badge if connected', async () => {
  //   await expectSaga(setConnectedWorker, setConnected(true))
  //     .call(chrome.action.setBadgeBackgroundColor, { color: '#55B6E2' })
  //     .call(chrome.action.setBadgeText, { text: ' ' })
  //     .silentRun();
  // });
  // eslint-disable-next-line jest/no-commented-out-tests
  // it('clears the badge when disconnected', async () => {
  //   await expectSaga(setConnectedWorker, setConnected(true))
  //     .call(chrome.action.setBadgeText, { text: '' })
  //     .silentRun();
  // });
});

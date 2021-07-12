import { signJsonRpcRequest } from '@signer/common';
import stringify from 'fast-json-stable-stringify';
import { chrome } from 'jest-chrome';
import { WebSocket } from 'mock-socket';
import { expectSaga } from 'redux-saga-test-plan';
import { call } from 'redux-saga-test-plan/matchers';

import { RelayTarget } from '../types';
import { createRandomPrivateKey } from '../utils';
import slice, {
  createConnection,
  createConnectionChannel,
  createPrivateKeyWorker,
  handleRequest,
  handleRequestWorker,
  message,
  send,
  setConnected,
  setPrivateKey,
  socketRequestWorker,
  socketWorker,
  waitForResponse
} from './sockets.slice';

jest.mock('mock-socket');
global.WebSocket = WebSocket;

const PRIVATE_KEY = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

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
  it('sends a request to the signer and sends the response back to the extension', async () => {
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
      .put(send(request))
      .call(waitForResponse, 'foo')
      .dispatch(message({ jsonrpc: '2.0', id: 'foo', result: 'bar' }))
      .silentRun();

    expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(0, {
      id: 'foo',
      target: RelayTarget.Content,
      data: 'bar'
    });
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

import { v4 as uuid } from 'uuid';

import { RelayTarget } from '../../types';
import { sleep } from '../../utils';
import { createBackgroundMessageSender } from '../background';
import { handleContentMessages } from './content';

const mockResponse = {
  id: '4653e3d5-b720-4b7f-8dce-41b7c8d9d8d8',
  target: 'Content',
  data: '0xf000'
};

jest.mock('../background', () => ({
  createBackgroundMessageSender: jest
    .fn()
    .mockImplementation(() => jest.fn().mockImplementation(() => Promise.resolve(mockResponse)))
}));

jest.mock('uuid', () => ({
  v4: jest.fn().mockImplementation(() => '4653e3d5-b720-4b7f-8dce-41b7c8d9d8d8')
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('handleContentMessages', () => {
  it('handles messages sent through the window API', async () => {
    jest.spyOn(window, 'addEventListener');
    jest.spyOn(window, 'postMessage');

    const mock = window.addEventListener as jest.MockedFunction<typeof window.addEventListener>;

    handleContentMessages();

    const message = {
      id: uuid(),
      target: RelayTarget.Content,
      payload: {
        method: 'eth_accounts',
        params: []
      }
    };

    const callback = mock.mock.calls[0][1] as (event: MessageEvent) => void;
    const sendMessage = (createBackgroundMessageSender as jest.MockedFunction<
      typeof createBackgroundMessageSender
    >).mock.results[0].value;

    callback({ data: message, origin: '*' } as MessageEvent);

    expect(sendMessage).toHaveBeenCalledWith(message);

    await sleep();

    expect(window.postMessage).toHaveBeenCalledWith(
      { ...mockResponse, target: RelayTarget.Page },
      '*'
    );
  });

  it('ignores invalid requests', () => {
    jest.spyOn(window, 'addEventListener');
    jest.spyOn(window, 'postMessage');

    const mock = window.addEventListener as jest.MockedFunction<typeof window.addEventListener>;

    handleContentMessages();

    const callback = mock.mock.calls[0][1] as (event: MessageEvent) => void;
    const sendMessage = (createBackgroundMessageSender as jest.MockedFunction<
      typeof createBackgroundMessageSender
    >).mock.results[0].value;

    callback({
      data: {
        id: uuid(),
        target: RelayTarget.Background,
        payload: {
          method: 'eth_accounts',
          params: []
        }
      },
      origin: '*'
    } as MessageEvent);

    callback({
      data: {
        id: uuid(),
        target: RelayTarget.Content
      },
      origin: '*'
    } as MessageEvent);

    callback({
      data: {
        id: 'foo',
        target: RelayTarget.Content,
        payload: {
          method: 'eth_accounts',
          params: []
        }
      },
      origin: '*'
    } as MessageEvent);

    expect(sendMessage).not.toHaveBeenCalled();
  });

  it('ignores invalid responses', async () => {
    jest.spyOn(window, 'addEventListener');
    jest.spyOn(window, 'postMessage');

    const mock = window.addEventListener as jest.MockedFunction<typeof window.addEventListener>;

    handleContentMessages();

    const message = {
      id: uuid(),
      target: RelayTarget.Content,
      payload: {
        method: 'eth_accounts',
        params: []
      }
    };

    const callback = mock.mock.calls[0][1] as (event: MessageEvent) => void;
    const sendMessage = (createBackgroundMessageSender as jest.MockedFunction<
      typeof createBackgroundMessageSender
    >).mock.results[0].value;

    sendMessage.mockImplementationOnce(() =>
      Promise.resolve({
        ...mockResponse,
        target: RelayTarget.Page
      })
    );

    callback({ data: message, origin: '*' } as MessageEvent);

    sendMessage.mockImplementationOnce(() =>
      Promise.resolve({
        foo: 'bar'
      })
    );

    callback({ data: message, origin: '*' } as MessageEvent);

    sendMessage.mockImplementationOnce(() =>
      Promise.resolve({
        ...mockResponse,
        id: 'foo'
      })
    );

    callback({ data: message, origin: '*' } as MessageEvent);

    expect(sendMessage).toHaveBeenCalledWith(message);

    await sleep();

    expect(window.postMessage).not.toHaveBeenCalled();
  });
});

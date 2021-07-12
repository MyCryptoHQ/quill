import { generateUUID } from '@signer/common';
import { chrome } from 'jest-chrome';

import { RelayTarget } from '../types';
import { sleep } from '../utils';
import { createBackgroundMessageSender } from './background';

describe('createBackgroundMessageSender', () => {
  it('sends messages using the Chrome API and waits for a response', async () => {
    const sendMessage = createBackgroundMessageSender(RelayTarget.Content, RelayTarget.Background);
    const message = { id: generateUUID(), payload: { method: 'eth_accounts', params: [] } };

    const listener = jest.fn().mockImplementation((response) => {
      expect(response.id).toBe(message.id);
      expect(response.data).toBe('0x0');
    });

    // eslint-disable-next-line jest/valid-expect-in-promise
    sendMessage(message).then(listener);

    await sleep();

    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
      ...message,
      target: RelayTarget.Background
    });
    chrome.runtime.onMessage.callListeners(
      { id: message.id, target: RelayTarget.Content, data: '0x0' },
      {},
      jest.fn()
    );

    await sleep();

    expect(listener).toHaveBeenCalled();
  });

  it('verifies the relay message', async () => {
    const sendMessage = createBackgroundMessageSender(RelayTarget.Content, RelayTarget.Background);
    const message = { id: generateUUID(), payload: { method: 'eth_accounts', params: [] } };

    const listener = jest.fn();

    // eslint-disable-next-line jest/valid-expect-in-promise
    sendMessage(message).then(listener);

    await sleep();

    chrome.runtime.onMessage.callListeners(
      { id: 'foo', target: RelayTarget.Content, data: '0x0' },
      {},
      jest.fn()
    );
    chrome.runtime.onMessage.callListeners(
      { id: message.id, target: RelayTarget.Content, foo: 'bar' },
      {},
      jest.fn()
    );
    chrome.runtime.onMessage.callListeners(
      { id: message.id, target: RelayTarget.Page, data: '0x0' },
      {},
      jest.fn()
    );

    await sleep();

    expect(listener).not.toHaveBeenCalled();
  });
});

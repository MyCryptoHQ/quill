import { generateUUID } from '@quill/common';

import { RelayTarget } from '../types';
import { sleep } from '../utils';
import { createWindowMessageSender } from './window';

describe('createWindowMessageSender', () => {
  jest.spyOn(window, 'postMessage');

  it('sends messages using the window API and waits for a response', async () => {
    const sendMessage = createWindowMessageSender(RelayTarget.Content, RelayTarget.Background);
    const message = { id: generateUUID(), payload: { method: 'eth_accounts', params: [] } };

    const listener = jest.fn().mockImplementation((response) => {
      expect(response.id).toBe(message.id);
      expect(response.data).toBe('0x0');
    });

    // eslint-disable-next-line jest/valid-expect-in-promise
    sendMessage(message).then(listener);

    await sleep();

    expect(window.postMessage).toHaveBeenCalledWith(
      { ...message, target: RelayTarget.Background },
      '*'
    );
    window.postMessage({ id: message.id, target: RelayTarget.Content, data: '0x0' }, '*');

    await sleep();

    expect(listener).toHaveBeenCalled();
  });

  it('verifies the relay message', async () => {
    const sendMessage = createWindowMessageSender(RelayTarget.Content, RelayTarget.Background);
    const message = { id: generateUUID(), payload: { method: 'eth_accounts', params: [] } };

    const listener = jest.fn();

    // eslint-disable-next-line jest/valid-expect-in-promise
    sendMessage(message).then(listener);

    await sleep();

    window.postMessage({ id: 'foo', target: RelayTarget.Content, data: '0x0' }, '*');
    window.postMessage({ id: message.id, target: RelayTarget.Content, foo: 'bar' }, '*');
    window.postMessage({ id: message.id, target: RelayTarget.Page, data: '0x0' }, '*');

    await sleep();

    expect(listener).not.toHaveBeenCalled();
  });
});

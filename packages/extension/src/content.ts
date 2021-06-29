/**
 * Content script that runs in a (somewhat isolated) page context. This injects a script into the actual page, and
 * relays any messages sent from it to the background script.
 */

import { is } from 'superstruct';

import { createBackgroundMessageSender } from './relay';
import { RelayMessageStruct, RelayResponseStruct, RelayTarget } from './types';
import { injectScript } from './utils/inject';

// Injects the page script into every tab
injectScript();

const sendMessage = createBackgroundMessageSender(RelayTarget.Content, RelayTarget.Background);

window.addEventListener('message', async (event: MessageEvent) => {
  if (
    event.source !== window ||
    !is(event.data, RelayMessageStruct) ||
    event.data.target !== RelayTarget.Content
  ) {
    return;
  }

  const response = await sendMessage(event.data);
  if (
    !is(response, RelayResponseStruct) ||
    response.id !== event.data.id ||
    response.target !== RelayTarget.Content
  ) {
    return;
  }

  window.postMessage({ ...response, target: RelayTarget.Page }, event.origin);
});

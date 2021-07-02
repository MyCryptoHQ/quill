import { is } from 'superstruct';

import type { RelayMessage, RelayResponse, RelayTarget } from '../types';
import { RelayResponseStruct } from '../types';

/**
 * Creates a message sender that will send a message through `chrome.runtime.sendMessage` and waits for a response based
 * on the request ID. This function does basic validation, but the result should be further validated before using.
 */
export const createBackgroundMessageSender = (
  self: RelayTarget,
  target: RelayTarget
): ((message: Omit<RelayMessage, 'target'>) => Promise<RelayResponse>) => {
  return (message) => {
    chrome.runtime.sendMessage({ ...message, target });

    return new Promise((resolve) => {
      const listener = (response: RelayResponse) => {
        if (
          !is(response, RelayResponseStruct) ||
          response.id !== message.id ||
          response.target !== self
        ) {
          return;
        }

        chrome.runtime.onMessage.removeListener(listener);
        resolve(response);
      };

      chrome.runtime.onMessage.addListener(listener);
    });
  };
};

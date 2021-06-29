import { is } from 'superstruct';

import type { RelayMessage, RelayResponse, RelayTarget } from '../types';
import { RelayResponseStruct } from '../types';

/**
 * Creates a message sender that will send a message through `window.postMessage` and waits for a response based on the
 * request ID. This function does basic validation, but the result should be further validated before using.
 */
export const createWindowMessageSender = (
  name: RelayTarget,
  target: RelayTarget
): ((message: Omit<RelayMessage, 'target'>) => Promise<RelayResponse>) => {
  return (message) => {
    window.postMessage({ ...message, target }, '*');

    return new Promise((resolve) => {
      const listener = (event: MessageEvent) => {
        if (
          event.source !== window ||
          !is(event.data, RelayResponseStruct) ||
          event.data.id !== message.id
        ) {
          return;
        }

        window.removeEventListener('message', listener);
        resolve(event.data);
      };

      window.addEventListener('message', listener);
    });
  };
};

import { v4 as uuid } from 'uuid';

import type { RequestArguments } from '../types';
import { ProviderRpcError, RelayTarget } from '../types';
import { createWindowMessageSender } from './window';

export const createProvider = () => {
  const sendMessage = createWindowMessageSender(RelayTarget.Page, RelayTarget.Content);

  return {
    isMyCrypto: true,
    request: async (payload: RequestArguments) => {
      const id = uuid();
      const response = await sendMessage({ id, payload });

      if (response.error) {
        throw new ProviderRpcError(response.error.message, response.error.code);
      }

      return response.data;
    },

    // @todo
    on: () => {
      throw new Error('Not implemented');
    },
    once: () => {
      throw new Error('Not implemented');
    },
    emit: () => {
      throw new Error('Not implemented');
    }
  };
};

export const injectProvider = () => {
  // @todo: Think about how to handle existing providers
  if (window.ethereum) {
    return console.warn('Existing window.ethereum provider detected, skipping injection');
  }

  window.ethereum = createProvider();
};

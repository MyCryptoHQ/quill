import { v4 as uuid } from 'uuid';

import type { Provider, RequestArguments } from '../types';
import { ProviderRpcError, RelayTarget } from '../types';
import { createWindowMessageSender } from './window';

export class WindowProvider implements Provider {
  isMyCrypto = true;

  private sendMessage = createWindowMessageSender(RelayTarget.Page, RelayTarget.Content);

  async request(payload: RequestArguments): Promise<unknown> {
    const id = uuid();
    const response = await this.sendMessage({ id, payload });

    if (response.error) {
      throw new ProviderRpcError(response.error.message, response.error.code);
    }

    return response.data;
  }

  async enable(): Promise<unknown> {
    return this.request({
      method: 'eth_requestAccounts',
      params: []
    });
  }

  // @todo
  on(): this {
    return this;
  }

  // @todo
  once(): this {
    return this;
  }

  // @todo
  emit(): boolean {
    return true;
  }

  // @todo
  removeAllListeners(): this {
    return this;
  }
}

export const injectProvider = () => {
  // @todo: Think about how to handle existing providers
  if (window.ethereum) {
    return console.warn('Existing window.ethereum provider detected, skipping injection');
  }

  window.ethereum = new WindowProvider();
};

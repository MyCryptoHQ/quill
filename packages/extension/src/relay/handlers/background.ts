import type { EnhancedStore } from '@reduxjs/toolkit';
import { is } from 'superstruct';

import type { ApplicationState } from '../../store';
import { handleRequest } from '../../store';
import { RelayMessageStruct, RelayTarget } from '../../types';
import { toJsonRpcRequest } from '../../utils';

// Request methods that are forwarded to the Signer application
const SIGNER_EVENTS: string[] = ['eth_accounts', 'eth_signTransaction'];

export const handleBackgroundMessages = (store: EnhancedStore<ApplicationState>) => {
  chrome.runtime.onMessage.addListener(async (data, sender) => {
    if (
      !sender.tab?.id ||
      !is(data, RelayMessageStruct) ||
      data.target !== RelayTarget.Background
    ) {
      return;
    }

    if (SIGNER_EVENTS.includes(data.payload.method)) {
      const request = toJsonRpcRequest(data);
      return store.dispatch(handleRequest({ request, tabId: sender.tab.id }));
    }

    // @todo Fetch result from network
    chrome.tabs.sendMessage(sender.tab.id, {
      id: data.id,
      target: RelayTarget.Content,
      result: '0xf000'
    });
  });
};

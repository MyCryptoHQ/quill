import type { EnhancedStore } from '@reduxjs/toolkit';
import { JsonRPCMethod } from '@signer/common';
import { is } from 'superstruct';

import type { ApplicationState } from '../../store';
import { handleJsonRpcRequest, handleRequest } from '../../store';
import { RelayMessageStruct, RelayTarget } from '../../types';
import { toJsonRpcRequest } from '../../utils';

// Request methods that are forwarded to the Signer application
const SIGNER_EVENTS: string[] = Object.values(JsonRPCMethod);

export const handleBackgroundMessages = (store: EnhancedStore<ApplicationState>) => {
  chrome.runtime.onMessage.addListener(async (data, sender) => {
    if (
      !sender.tab?.id ||
      !is(data, RelayMessageStruct) ||
      data.target !== RelayTarget.Background
    ) {
      return;
    }

    const request = toJsonRpcRequest(data);
    if (SIGNER_EVENTS.includes(data.payload.method)) {
      return store.dispatch(handleRequest({ request, tabId: sender.tab.id }));
    }

    store.dispatch(
      handleJsonRpcRequest({
        tabId: sender.tab.id,
        request
      })
    );
  });
};

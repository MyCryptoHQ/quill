import { chrome } from 'jest-chrome';
import createMockStore from 'redux-mock-store';
import { v4 as uuid } from 'uuid';

import type { ApplicationState } from '../../store';
import { handleRequest } from '../../store';
import { RelayTarget } from '../../types';
import { toJsonRpcRequest } from '../../utils';
import { handleBackgroundMessages } from './background';

jest.mock('uuid', () => ({
  v4: jest.fn().mockImplementation(() => '4653e3d5-b720-4b7f-8dce-41b7c8d9d8d8')
}));

describe('handleBackgroundMessages', () => {
  it('handles messages sent through the browser API', () => {
    const store = createMockStore<ApplicationState>()();
    handleBackgroundMessages(store);

    const message = {
      id: uuid(),
      target: RelayTarget.Background,
      payload: {
        method: 'eth_accounts',
        params: []
      }
    };

    chrome.runtime.onMessage.callListeners(
      message,
      { tab: { id: 1 } as chrome.tabs.Tab },
      jest.fn()
    );

    expect(store.getActions()).toStrictEqual([
      handleRequest({
        request: toJsonRpcRequest(message),
        tabId: 1
      })
    ]);
  });

  it('ignores invalid requests', () => {
    const store = createMockStore<ApplicationState>()();
    handleBackgroundMessages(store);

    chrome.runtime.onMessage.callListeners(
      {
        id: uuid(),
        target: RelayTarget.Content,
        payload: {
          method: 'eth_accounts',
          params: []
        }
      },
      { tab: { id: 1 } as chrome.tabs.Tab },
      jest.fn()
    );

    chrome.runtime.onMessage.callListeners(
      {
        id: uuid(),
        target: RelayTarget.Background
      },
      { tab: { id: 1 } as chrome.tabs.Tab },
      jest.fn()
    );

    chrome.runtime.onMessage.callListeners(
      {
        id: 'foo',
        target: RelayTarget.Background,
        payload: {
          method: 'eth_accounts',
          params: []
        }
      },
      { tab: { id: 1 } as chrome.tabs.Tab },
      jest.fn()
    );

    expect(store.getActions()).toHaveLength(0);
  });
});

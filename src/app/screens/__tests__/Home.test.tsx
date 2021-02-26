import React from 'react';

import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';

import { createStore } from '@app/store';
import { fAccount } from '@fixtures';
import { JsonRPCRequest } from '@types';

import { Home } from '../Home';

jest.mock('@bridge', () => ({
  ipcBridgeRenderer: {
    api: {
      subscribeToRequests: (callback: (request: JsonRPCRequest) => void) => {
        const request = {
          id: 1,
          jsonrpc: '2.0' as const,
          method: 'eth_signTransaction',
          params: [{ from: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520' }]
        };
        callback(request);
        callback({ id: 2, ...request });
        return () => true;
      },
      sendResponse: jest.fn()
    },
    crypto: { invoke: jest.fn() }
  }
}));

function getComponent() {
  return render(
    <Router>
      <Provider
        store={createStore({
          preloadedState: {
            // @ts-expect-error Brand bug with DeepPartial
            accounts: [fAccount]
          }
        })}
      >
        <Home />
      </Provider>
    </Router>
  );
}

describe('Home', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders', async () => {
    const { getByText } = getComponent();
    expect(getByText('Manage').textContent).toBeDefined();
  });
});

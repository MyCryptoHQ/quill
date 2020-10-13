import React from 'react';

import { fireEvent, render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';

import { createStore } from '@app/store';
import { ipcBridgeRenderer } from '@bridge';
import { fAccount } from '@fixtures';
import { JsonRPCRequest } from '@types';

import { Home } from '.';

jest.mock('@bridge', () => ({
  ipcBridgeRenderer: {
    api: {
      subscribeToRequests: (callback: (request: JsonRPCRequest) => void) => {
        const request = {
          id: 1,
          jsonrpc: '2.0',
          method: 'eth_signTransaction',
          params: [{ from: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520' }]
        };
        callback(request);
        callback({ id: 2, ...request });
        return () => true;
      },
      sendResponse: jest.fn()
    },
    crypto: { invoke: jest.fn() },
    secrets: { invoke: jest.fn() }
  }
}));

// Cast to unknown due to type weirdness - possibly a bug in Brand
const accounts: Record<string, unknown> = { '4be38596-5d9c-5c01-8e04-19d1c726fe24': fAccount };

function getComponent() {
  return render(
    <Router>
      <Provider
        store={createStore({
          preloadedState: {
            accounts: { accounts }
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
    expect(getByText('Accept').textContent).toBeDefined();
  });

  it('can deny tx', async () => {
    const { getByText } = getComponent();
    const denyButton = getByText('Deny');
    expect(denyButton.textContent).toBeDefined();

    fireEvent.click(denyButton);

    expect(ipcBridgeRenderer.api.sendResponse).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1, error: expect.objectContaining({ code: '-32000' }) })
    );
  });

  it('can accept tx', async () => {
    const { getByText, getByLabelText } = getComponent();
    const acceptButton = getByText('Accept');
    expect(acceptButton.textContent).toBeDefined();

    const privkeyInput = getByLabelText('Private Key');
    expect(privkeyInput).toBeDefined();
    fireEvent.change(privkeyInput, { target: { value: 'privkey' } });

    fireEvent.click(acceptButton);

    expect(ipcBridgeRenderer.crypto.invoke).toHaveBeenCalled();

    await waitFor(() =>
      expect(ipcBridgeRenderer.api.sendResponse).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1 })
      )
    );
  });
});

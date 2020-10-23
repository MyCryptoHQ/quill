import React from 'react';

import { fireEvent, render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';

import { getAddress } from '@app/services';
import { createStore } from '@app/store';
import { ipcBridgeRenderer } from '@bridge';
import { fAccount, fAccounts, fMnemonicPhrase } from '@fixtures';
import { JsonRPCRequest } from '@types';

import { SignTransaction } from '../SignTransaction';

jest.mock('@bridge', () => ({
  ipcBridgeRenderer: {
    api: {
      subscribeToRequests: jest
        .fn()
        .mockImplementationOnce((callback: (request: JsonRPCRequest) => void) => {
          callback({
            id: 1,
            jsonrpc: '2.0',
            method: 'eth_signTransaction',
            params: [{ from: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520' }]
          });
          return () => true;
        })
        .mockImplementationOnce((callback: (request: JsonRPCRequest) => void) => {
          callback({
            id: 2,
            jsonrpc: '2.0',
            method: 'eth_signTransaction',
            params: [{ from: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520' }]
          });
          return () => true;
        })
        .mockImplementationOnce((callback: (request: JsonRPCRequest) => void) => {
          callback({
            id: 3,
            jsonrpc: '2.0',
            method: 'eth_signTransaction',
            params: [{ from: '0x2a8aBa3dDD5760EE7BbF03d2294BD6134D0f555f' }]
          });
          return () => true;
        })
        .mockImplementation((callback: (request: JsonRPCRequest) => void) => {
          callback({
            id: 4,
            jsonrpc: '2.0',
            method: 'eth_signTransaction',
            params: [{ from: '0xF0850b736BB0DE14AE95718569A5032C944e86C8' }]
          });
          return () => true;
        }),
      sendResponse: jest.fn()
    },
    crypto: { invoke: jest.fn() },
    db: { invoke: jest.fn().mockImplementation(() => Promise.resolve('privatekey')) }
  }
}));

jest.mock('@app/services/WalletService', () => ({
  ...jest.requireActual('@app/services/WalletService'),
  getAddress: jest.fn().mockImplementation(() =>
    Promise.resolve({
      uuid: '9b902e45-84be-5e97-b3a8-f937588397b4',
      address: '0x2a8aBa3dDD5760EE7BbF03d2294BD6134D0f555f',
      dPath: "m/44'/60'/0'/0/0",
      privateKey: '0x827207adb7a16d059733b097c5afdcb5373e746007a87e041a9d9d8e926abc93'
    })
  )
}));

// Cast to unknown due to type weirdness - possibly a bug in Brand
const accounts: Record<string, unknown> = {
  '4be38596-5d9c-5c01-8e04-19d1c726fe24': fAccount,
  '9b902e45-84be-5e97-b3a8-f937588397b4': fAccounts[1],
  '4175e739-2c60-5717-8e8a-a4f9974dcee2': fAccounts[2]
};

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
        <SignTransaction />
      </Provider>
    </Router>
  );
}

describe('SignTransaction', () => {
  it('renders', async () => {
    const { getByText } = getComponent();
    expect(getByText('Accept').textContent).toBeDefined();
  });

  it('can accept tx with private key', async () => {
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
        expect.objectContaining({ id: 2 })
      )
    );
  });

  it('can accept tx with mnemonic', async () => {
    const { getByText, getByLabelText } = getComponent();
    const acceptButton = getByText('Accept');
    expect(acceptButton.textContent).toBeDefined();

    const mnemonicInput = getByLabelText('Mnemonic Phrase');
    expect(mnemonicInput).toBeDefined();
    fireEvent.change(mnemonicInput, { target: { value: fMnemonicPhrase } });

    const passwordInput = getByLabelText('Password');
    fireEvent.change(passwordInput, { target: { value: 'password' } });

    fireEvent.click(acceptButton);

    expect(getAddress).toHaveBeenCalled();

    await waitFor(() =>
      expect(ipcBridgeRenderer.api.sendResponse).toHaveBeenCalledWith(
        expect.objectContaining({ id: 3 })
      )
    );
  });

  it('can accept tx with a persistent private key', async () => {
    const { getByText } = getComponent();
    const acceptButton = getByText('Accept');
    expect(acceptButton.textContent).toBeDefined();

    fireEvent.click(acceptButton);

    expect(getAddress).toHaveBeenCalled();

    await waitFor(() =>
      expect(ipcBridgeRenderer.api.sendResponse).toHaveBeenCalledWith(
        expect.objectContaining({ id: 4 })
      )
    );
  });

  it('can deny tx', async () => {
    const { getByText } = getComponent();
    const denyButton = getByText('Deny');
    expect(denyButton.textContent).toBeDefined();

    fireEvent.click(denyButton);

    expect(ipcBridgeRenderer.api.sendResponse).toHaveBeenCalledWith(
      expect.objectContaining({ id: 4, error: expect.objectContaining({ code: '-32000' }) })
    );
  });
});
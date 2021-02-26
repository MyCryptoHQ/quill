import React from 'react';

import { EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';

import { ApplicationState, createStore } from '@app/store';
import { ipcBridgeRenderer } from '@bridge';
import { fMnemonicPhrase } from '@fixtures';
import { WalletType } from '@types';

import { AddAccount } from '../AddAccount';

jest.mock('@bridge', () => ({
  ipcBridgeRenderer: {
    db: { invoke: jest.fn() },
    crypto: {
      invoke: jest
        .fn()
        .mockImplementation(({ type }) =>
          Promise.resolve(
            type === 'GET_ADDRESSES'
              ? [
                  { address: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520' },
                  { address: '0x2a8aBa3dDD5760EE7BbF03d2294BD6134D0f555f' }
                ]
              : '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520'
          )
        )
    }
  }
}));

function getComponent(store: EnhancedStore<ApplicationState> = createStore()) {
  return render(
    <Router>
      <Provider store={store}>
        <AddAccount />
      </Provider>
    </Router>
  );
}

describe('AddAccount', () => {
  it('renders', async () => {
    const { getByText } = getComponent();
    expect(getByText('Submit').textContent).toBeDefined();
  });

  it('can submit private key', async () => {
    const store = createStore();
    const { getByLabelText, getByText } = getComponent(store);
    const privKeyInput = getByLabelText('Private Key');
    expect(privKeyInput).toBeDefined();
    fireEvent.change(privKeyInput, { target: { value: 'privkey' } });

    const persistenceInput = getByLabelText('Persistence');
    fireEvent.click(persistenceInput);

    const submitButton = getByText('Submit');
    expect(submitButton).toBeDefined();
    fireEvent.click(submitButton);
    expect(ipcBridgeRenderer.crypto.invoke).toHaveBeenCalledWith(
      expect.objectContaining({
        wallet: { walletType: WalletType.PRIVATE_KEY, privateKey: 'privkey' }
      })
    );
    await waitFor(() => expect(Object.keys(store.getState().accounts.accounts)).toHaveLength(1));
  });

  it('can submit mnemonic', async () => {
    const store = createStore();
    const { getByLabelText, getByText } = getComponent(store);
    const walletTypeInput = getByLabelText('Type');
    expect(walletTypeInput).toBeDefined();
    fireEvent.change(walletTypeInput, { target: { value: 'MNEMONIC' } });

    const mnemonicInput = getByLabelText('Mnemonic Phrase');
    expect(mnemonicInput).toBeDefined();
    fireEvent.change(mnemonicInput, { target: { value: fMnemonicPhrase } });

    const passwordInput = getByLabelText('Password');
    fireEvent.change(passwordInput, { target: { value: 'password' } });

    const persistenceInput = getByLabelText('Persistence');
    fireEvent.click(persistenceInput);

    const submitButton = getByText('Next');
    expect(submitButton).toBeDefined();
    fireEvent.click(submitButton);

    const address = '0x2a8aBa3dDD5760EE7BbF03d2294BD6134D0f555f';
    await waitFor(() => expect(getByText(address)).toBeDefined());
    fireEvent.click(getByText(address));

    expect(ipcBridgeRenderer.crypto.invoke).toHaveBeenCalledWith(
      expect.objectContaining({
        wallet: expect.objectContaining({
          walletType: WalletType.MNEMONIC,
          mnemonicPhrase: fMnemonicPhrase
        })
      })
    );
    await waitFor(() => expect(Object.keys(store.getState().accounts.accounts)).toHaveLength(1));
  });
});

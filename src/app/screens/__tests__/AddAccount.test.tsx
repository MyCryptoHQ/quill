import React from 'react';

import { DeepPartial, EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';

import { ApplicationState, fetchAccount } from '@app/store';
import { fMnemonicPhrase } from '@fixtures';
import { WalletType } from '@types';

import { AddAccount } from '../AddAccount';
import configureStore from 'redux-mock-store';

jest.mock('@bridge', () => ({
  ipcBridgeRenderer: {
    crypto: {
      invoke: jest.fn(() => ([{
        address: '0x2a8aBa3dDD5760EE7BbF03d2294BD6134D0f555f',
        dPath: "m/44'/60'/0'/0/0"
      }]))
    }
  }
}))

const createMockStore = configureStore<DeepPartial<ApplicationState>>();
const mockStore = createMockStore();

function getComponent(store: EnhancedStore<DeepPartial<ApplicationState>> = mockStore) {
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
    const { getByLabelText, getByText } = getComponent();
    const privKeyInput = getByLabelText('Private Key');
    expect(privKeyInput).toBeDefined();
    fireEvent.change(privKeyInput, { target: { value: 'privkey' } });

    const persistenceInput = getByLabelText('Persistence');
    fireEvent.click(persistenceInput);

    const submitButton = getByText('Submit');
    expect(submitButton).toBeDefined();
    fireEvent.click(submitButton);

    //
    expect(mockStore.getActions()).toContainEqual(
      fetchAccount({
        walletType: WalletType.PRIVATE_KEY,
        privateKey: 'privkey'
      })
    );
  });

  it('can submit mnemonic', async () => {
    const { getByLabelText, getByText } = getComponent();
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

    expect(mockStore.getActions()).toContainEqual(
      fetchAccount({
        walletType: WalletType.MNEMONIC,
        mnemonicPhrase: fMnemonicPhrase,
        passphrase: 'password',
        path: "m/44'/60'/0'/0/0"
      })
    );
  });
});

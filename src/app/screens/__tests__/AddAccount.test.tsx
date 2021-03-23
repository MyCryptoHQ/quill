import React from 'react';

import { DeepPartial, EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import selectEvent from 'react-select-event';
import configureStore from 'redux-mock-store';

import { handleRequest } from '@api/crypto';
import { ApplicationState, fetchAccounts } from '@app/store';
import { ipcBridgeRenderer } from '@bridge';
import { DPathsList } from '@data';
import { fKeystore, fKeystorePassword, fMnemonicPhrase, fPrivateKey } from '@fixtures';
import { AddAccount } from '@screens';
import { translateRaw } from '@translations';
import { WalletType } from '@types';

jest.mock('electron-store');

jest.mock('@bridge', () => ({
  ipcBridgeRenderer: {
    crypto: {
      invoke: jest.fn(() => [
        {
          address: '0x2a8aBa3dDD5760EE7BbF03d2294BD6134D0f555f',
          dPath: "m/44'/60'/0'/0/0"
        }
      ])
    }
  }
}));

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
    const { getByText, getByTestId, container } = getComponent();
    const privateKeyButton = getByTestId('select-PRIVATE_KEY');
    expect(privateKeyButton).toBeDefined();
    fireEvent.click(privateKeyButton);

    const privKeyInput = container.querySelector('input[name="privateKey"]');
    expect(privKeyInput).toBeDefined();
    fireEvent.change(privKeyInput, { target: { value: fPrivateKey } });

    const persistenceInput = getByTestId('toggle-persistence');
    fireEvent.click(persistenceInput);
    fireEvent.click(persistenceInput);

    const submitButton = getByText('Submit');
    expect(submitButton).toBeDefined();
    await waitFor(() => fireEvent.click(submitButton));

    expect(mockStore.getActions()).toContainEqual(
      fetchAccounts([
        {
          walletType: WalletType.PRIVATE_KEY,
          privateKey: fPrivateKey,
          persistent: true
        }
      ])
    );
  });

  it('can submit keystore file', async () => {
    const { container, getByText, getByTestId } = getComponent();
    const keystoreButton = getByTestId('select-KEYSTORE');
    expect(keystoreButton).toBeDefined();
    fireEvent.click(keystoreButton);

    const keystoreBlob = new Blob([fKeystore], { type: 'application/json' });
    const keystoreFile = new File([keystoreBlob], 'keystore.json');
    keystoreFile.text = async () => fKeystore;

    const keystoreInput = getByTestId('file-upload');
    expect(keystoreInput).toBeDefined();
    fireEvent.change(keystoreInput, { target: { files: [keystoreFile] } });

    const passwordInput = container.querySelector('input[name="password"]');
    expect(passwordInput).toBeDefined();
    fireEvent.change(passwordInput, { target: { value: fKeystorePassword } });

    const persistenceInput = getByTestId('toggle-persistence');
    fireEvent.click(persistenceInput);
    fireEvent.click(persistenceInput);

    const submitButton = getByText('Submit');
    expect(submitButton).toBeDefined();
    await waitFor(() => fireEvent.click(submitButton));

    expect(mockStore.getActions()).toContainEqual(
      fetchAccounts([
        {
          walletType: WalletType.KEYSTORE,
          keystore: fKeystore,
          password: fKeystorePassword,
          persistent: true
        }
      ])
    );
  });

  it('can submit keystore file via drag and drop', async () => {
    const { container, getByText, getByTestId } = getComponent();
    const keystoreButton = getByTestId('select-KEYSTORE');
    expect(keystoreButton).toBeDefined();
    fireEvent.click(keystoreButton);

    const keystoreBlob = new Blob([fKeystore], { type: 'application/json' });
    const keystoreFile = new File([keystoreBlob], 'keystore.json');
    keystoreFile.text = async () => fKeystore;

    const keystoreInput = getByTestId('file-upload');
    expect(keystoreInput).toBeDefined();
    fireEvent.dragOver(keystoreInput);
    fireEvent.drop(keystoreInput, { dataTransfer: { files: [keystoreFile] } });

    const passwordInput = container.querySelector('input[name="password"]');
    expect(passwordInput).toBeDefined();
    fireEvent.change(passwordInput, { target: { value: fKeystorePassword } });

    const persistenceInput = getByTestId('toggle-persistence');
    fireEvent.click(persistenceInput);
    fireEvent.click(persistenceInput);

    const submitButton = getByText('Submit');
    expect(submitButton).toBeDefined();
    await waitFor(() => fireEvent.click(submitButton));

    expect(mockStore.getActions()).toContainEqual(
      fetchAccounts([
        {
          walletType: WalletType.KEYSTORE,
          keystore: fKeystore,
          password: fKeystorePassword,
          persistent: true
        }
      ])
    );
  });

  it('can submit mnemonic', async () => {
    const { getByLabelText, getByText, getByTestId } = getComponent();
    const mnemonicButton = getByTestId('select-MNEMONIC');
    expect(mnemonicButton).toBeDefined();
    fireEvent.click(mnemonicButton);

    await waitFor(() => expect(getByTestId('mnemonic-input')).toBeDefined());

    const mnemonicInput = getByTestId('mnemonic-input');
    expect(mnemonicInput).toBeDefined();
    fireEvent.change(mnemonicInput, { target: { value: fMnemonicPhrase } });

    const passwordInput = getByLabelText(translateRaw('MNEMONIC_PASSWORD'));
    fireEvent.change(passwordInput, { target: { value: 'password' } });

    const persistenceInput = getByTestId('toggle-persistence');
    fireEvent.click(persistenceInput);
    fireEvent.click(persistenceInput);

    const submitButton = getByText(translateRaw('NEXT'));
    expect(submitButton).toBeDefined();
    fireEvent.click(submitButton);

    const address = '0x2a8aBa3dDD5760EE7BbF03d2294BD6134D0f555f';
    await waitFor(() => expect(getByText(address)).toBeDefined());
    fireEvent.click(getByTestId(`checkbox-${address}`));

    fireEvent.click(getByText(translateRaw('SUBMIT')));

    expect(mockStore.getActions()).toContainEqual(
      fetchAccounts([
        {
          walletType: WalletType.MNEMONIC,
          mnemonicPhrase: fMnemonicPhrase,
          passphrase: 'password',
          path: "m/44'/60'/0'/0/0",
          persistent: true
        }
      ])
    );
  });

  it('can submit mnemonic from another DPath and page', async () => {
    ipcBridgeRenderer.crypto.invoke = jest.fn().mockImplementation(handleRequest);

    const { getByLabelText, getByText, getByTestId } = getComponent();
    const mnemonicButton = getByTestId('select-MNEMONIC');
    expect(mnemonicButton).toBeDefined();
    fireEvent.click(mnemonicButton);

    await waitFor(() => expect(getByTestId('mnemonic-input')).toBeDefined());

    const mnemonicInput = getByTestId('mnemonic-input');
    expect(mnemonicInput).toBeDefined();
    fireEvent.change(mnemonicInput, { target: { value: fMnemonicPhrase } });

    const passwordInput = getByLabelText(translateRaw('MNEMONIC_PASSWORD'));
    fireEvent.change(passwordInput, { target: { value: 'password' } });

    const persistenceInput = getByTestId('toggle-persistence');
    fireEvent.click(persistenceInput);
    fireEvent.click(persistenceInput);

    const submitButton = getByText(translateRaw('NEXT'));
    expect(submitButton).toBeDefined();
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(getByText(DPathsList.ETH_DEFAULT.label, { exact: false })).toBeDefined()
    );

    const dPathMenu = getByText(DPathsList.ETH_DEFAULT.label, { exact: false });
    await selectEvent.openMenu(dPathMenu);

    await waitFor(() => expect(getByTestId('select-EWC_DEFAULT')).toBeDefined());

    const dPathOption = getByTestId('select-EWC_DEFAULT');
    fireEvent.click(dPathOption);

    const address = '0x0A5A196b0F565103C67A9B7A835e9C988Aff6403';
    await waitFor(() => expect(getByText(address)).toBeDefined());
    fireEvent.click(getByTestId(`checkbox-${address}`));

    fireEvent.click(getByText(translateRaw('NEXT')));

    const secondAddress = '0x0e0770FaBfd7466C87646A555e46f5Af35920366';
    await waitFor(() => expect(getByText(secondAddress)).toBeDefined());
    fireEvent.click(getByTestId(`checkbox-${secondAddress}`));

    fireEvent.click(getByText(translateRaw('PREVIOUS')));

    await waitFor(() => expect(getByText(address)).toBeDefined());
    fireEvent.click(getByTestId(`checkbox-${address}`));

    const thirdAddress = '0xe3e690609B64B05D1e3669EA49555f5BAB61e537';
    await waitFor(() => expect(getByText(thirdAddress)).toBeDefined());
    fireEvent.click(getByTestId(`checkbox-${thirdAddress}`));

    fireEvent.click(getByText(translateRaw('SUBMIT')));

    expect(mockStore.getActions()).toContainEqual(
      fetchAccounts([
        {
          walletType: WalletType.MNEMONIC,
          mnemonicPhrase: fMnemonicPhrase,
          passphrase: 'password',
          path: "m/44'/246'/0'/0/19",
          persistent: true
        },
        {
          walletType: WalletType.MNEMONIC,
          mnemonicPhrase: fMnemonicPhrase,
          passphrase: 'password',
          path: "m/44'/246'/0'/0/6",
          persistent: true
        }
      ])
    );
  });
});

import { DEFAULT_ETH, DEFAULT_EWC } from '@mycrypto/wallets';
import { DeepPartial, EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import selectEvent from 'react-select-event';
import configureStore from 'redux-mock-store';

import { handleRequest } from '@api/crypto';
import { ApplicationState, createStore, fetchAccounts } from '@app/store';
import { ipcBridgeRenderer } from '@bridge';
import { translateRaw } from '@common/translate';
import { fKeystore, fKeystorePassword, fMnemonicPhrase, fPrivateKey } from '@fixtures';
import { AddAccount } from '@screens';
import { WalletType } from '@types';

jest.mock('electron-store');

jest.mock('@bridge', () => ({
  ipcBridgeRenderer: {
    crypto: {
      invoke: jest.fn()
    },
    api: {
      subscribeToRequests: jest.fn()
    }
  }
}));

const createMockStore = configureStore<DeepPartial<ApplicationState>>();
const mockStore = createMockStore({
  accounts: { accounts: [], isFetching: false, fetchError: undefined }
});

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
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders', async () => {
    const { getByText } = getComponent();
    expect(getByText(translateRaw('SUBMIT')).textContent).toBeDefined();
  });

  it('renders errors from Redux', async () => {
    const error = 'foobar';
    const { getByText } = getComponent(
      createMockStore({
        accounts: { accounts: [], isFetching: false, fetchError: error }
      })
    );
    expect(getByText(error).textContent).toBeDefined();
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

    const submitButton = getByText(translateRaw('SUBMIT'));
    expect(submitButton).toBeDefined();
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(mockStore.getActions()).toContainEqual(
        fetchAccounts([
          {
            walletType: WalletType.PRIVATE_KEY,
            privateKey: fPrivateKey,
            persistent: true
          }
        ])
      )
    );
  });

  it('shows private key form validation', async () => {
    const { getByText, getByTestId } = getComponent();
    const privateKeyButton = getByTestId('select-PRIVATE_KEY');
    expect(privateKeyButton).toBeDefined();
    fireEvent.click(privateKeyButton);

    const submitButton = getByText(translateRaw('SUBMIT'));
    expect(submitButton).toBeDefined();
    fireEvent.click(submitButton);

    await waitFor(() => expect(getByText(translateRaw('PRIVATE_KEY_EMPTY'))).toBeDefined());
  });

  it('shows private key Redux error', async () => {
    // @ts-expect-error Brand bug with DeepPartial
    const { getByText, getByTestId, container } = getComponent(createStore());
    const privateKeyButton = getByTestId('select-PRIVATE_KEY');
    expect(privateKeyButton).toBeDefined();
    fireEvent.click(privateKeyButton);

    const privKeyInput = container.querySelector('input[name="privateKey"]');
    expect(privKeyInput).toBeDefined();
    fireEvent.change(privKeyInput, { target: { value: 'bla' } });

    ipcBridgeRenderer.crypto.invoke = jest.fn().mockImplementation(() => {
      throw new Error('error');
    });

    const submitButton = getByText(translateRaw('SUBMIT'));
    expect(submitButton).toBeDefined();
    fireEvent.click(submitButton);

    await waitFor(() => expect(getByText('error', { exact: false })).toBeDefined());
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

    const submitButton = getByText(translateRaw('SUBMIT'));
    expect(submitButton).toBeDefined();
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(mockStore.getActions()).toContainEqual(
        fetchAccounts([
          {
            walletType: WalletType.KEYSTORE,
            keystore: fKeystore,
            password: fKeystorePassword,
            persistent: true
          }
        ])
      )
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

  it('shows keystore form validation', async () => {
    const { getByText, getByTestId } = getComponent();
    const keystoreButton = getByTestId('select-KEYSTORE');
    expect(keystoreButton).toBeDefined();
    fireEvent.click(keystoreButton);

    const submitButton = getByText(translateRaw('SUBMIT'));
    expect(submitButton).toBeDefined();
    fireEvent.click(submitButton);

    await waitFor(() => expect(getByText(translateRaw('KEYSTORE_EMPTY'))).toBeDefined());
  });

  it('shows keystore Redux error', async () => {
    // @ts-expect-error Brand bug with DeepPartial
    const { getByText, getByTestId, container } = getComponent(createStore());
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

    ipcBridgeRenderer.crypto.invoke = jest.fn().mockImplementation(() => {
      throw new Error('error');
    });

    console.debug('Submitting');
    const submitButton = getByText(translateRaw('SUBMIT'));
    expect(submitButton).toBeDefined();
    fireEvent.click(submitButton);

    await waitFor(() => expect(getByText('error', { exact: false })).toBeDefined());
  });

  it('shows keystore file error', async () => {
    const { getByText, getByTestId, container } = getComponent();
    const keystoreButton = getByTestId('select-KEYSTORE');
    expect(keystoreButton).toBeDefined();
    fireEvent.click(keystoreButton);

    const keystoreBlob = new Blob([fKeystore], { type: 'application/json' });
    const keystoreFile = new File([keystoreBlob], 'keystore.json');
    keystoreFile.text = async () => {
      throw new Error('error');
    };

    const keystoreInput = getByTestId('file-upload');
    expect(keystoreInput).toBeDefined();
    fireEvent.dragOver(keystoreInput);
    fireEvent.drop(keystoreInput, { dataTransfer: { files: [keystoreFile] } });

    const passwordInput = container.querySelector('input[name="password"]');
    expect(passwordInput).toBeDefined();
    fireEvent.change(passwordInput, { target: { value: fKeystorePassword } });

    const submitButton = getByText(translateRaw('SUBMIT'));
    expect(submitButton).toBeDefined();
    fireEvent.click(submitButton);

    await waitFor(() => expect(getByText('error', { exact: false })).toBeDefined());
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

    ipcBridgeRenderer.crypto.invoke = jest.fn().mockImplementation(() => [
      {
        address: '0x2a8aBa3dDD5760EE7BbF03d2294BD6134D0f555f',
        dPath: "m/44'/60'/0'/0/0",
        index: 0
      }
    ]);

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
          path: DEFAULT_ETH,
          index: 0,
          persistent: true
        }
      ])
    );
  });

  it('shows mnemonic form validation', async () => {
    const { getByText, getByTestId } = getComponent();
    const mnemonicButton = getByTestId('select-MNEMONIC');
    expect(mnemonicButton).toBeDefined();
    fireEvent.click(mnemonicButton);

    const submitButton = getByText(translateRaw('NEXT'));
    expect(submitButton).toBeDefined();
    fireEvent.click(submitButton);

    await waitFor(() => expect(getByText(translateRaw('MNEMONIC_EMPTY'))).toBeDefined());
  });

  it('shows mnemonic crypto error', async () => {
    // @ts-expect-error Brand bug with DeepPartial
    const { getByLabelText, getByText, getByTestId } = getComponent(createStore());
    const mnemonicButton = getByTestId('select-MNEMONIC');
    expect(mnemonicButton).toBeDefined();
    fireEvent.click(mnemonicButton);

    await waitFor(() => expect(getByTestId('mnemonic-input')).toBeDefined());

    const mnemonicInput = getByTestId('mnemonic-input');
    expect(mnemonicInput).toBeDefined();
    fireEvent.change(mnemonicInput, { target: { value: fMnemonicPhrase } });

    const passwordInput = getByLabelText(translateRaw('MNEMONIC_PASSWORD'));
    fireEvent.change(passwordInput, { target: { value: 'password' } });

    ipcBridgeRenderer.crypto.invoke = jest.fn().mockImplementation(() => {
      throw new Error('error');
    });

    const submitButton = getByText(translateRaw('NEXT'));
    expect(submitButton).toBeDefined();
    fireEvent.click(submitButton);

    await waitFor(() => expect(getByText('error', { exact: false })).toBeDefined());
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

    await waitFor(() => expect(getByText(DEFAULT_ETH.name, { exact: false })).toBeDefined());

    const dPathMenu = getByText(DEFAULT_ETH.name, { exact: false });
    await selectEvent.openMenu(dPathMenu);

    await waitFor(() => expect(getByTestId(`select-${DEFAULT_EWC.name}`)).toBeDefined());

    const dPathOption = getByTestId(`select-${DEFAULT_EWC.name}`);
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
          path: DEFAULT_EWC,
          index: 19,
          persistent: true
        },
        {
          walletType: WalletType.MNEMONIC,
          mnemonicPhrase: fMnemonicPhrase,
          passphrase: 'password',
          path: DEFAULT_EWC,
          index: 6,
          persistent: true
        }
      ])
    );
  });
});

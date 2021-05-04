import { DEFAULT_ETH } from '@mycrypto/wallets';
import type { EnhancedStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import type { ApplicationState } from '@app/store';
import { fetchAccounts, fetchAddresses, fetchReset } from '@common/store';
import { translateRaw } from '@common/translate';
import { fKeystore, fKeystorePassword, fMnemonicPhrase, fPrivateKey } from '@fixtures';
import { AddAccount } from '@screens';
import type { DeepPartial } from '@types';
import { WalletType } from '@types';

jest.mock('electron-store');

const createMockStore = configureStore<DeepPartial<ApplicationState>>();
const mockStore = createMockStore({
  accounts: { accounts: [], addresses: [], isFetching: false, fetchError: undefined }
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
    expect(getByText(translateRaw('VERIFY_ACCOUNT')).textContent).toBeDefined();
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

  it('calls fetchReset on unmount', () => {
    const store = createMockStore({ accounts: {} });
    const { unmount } = getComponent(store);

    unmount();

    expect(store.getActions()).toContainEqual(fetchReset());
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

    const submitButton = getByText(translateRaw('VERIFY_ACCOUNT'));
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

    const submitButton = getByText(translateRaw('VERIFY_ACCOUNT'));
    expect(submitButton).toBeDefined();
    fireEvent.click(submitButton);

    await waitFor(() => expect(getByText(translateRaw('PRIVATE_KEY_EMPTY'))).toBeDefined());
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

    const submitButton = getByText(translateRaw('VERIFY_ACCOUNT'));
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

    const submitButton = getByText(translateRaw('VERIFY_ACCOUNT'));
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

    const submitButton = getByText(translateRaw('VERIFY_ACCOUNT'));
    expect(submitButton).toBeDefined();
    fireEvent.click(submitButton);

    await waitFor(() => expect(getByText(translateRaw('KEYSTORE_EMPTY'))).toBeDefined());
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

    const submitButton = getByText(translateRaw('VERIFY_ACCOUNT'));
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

    const submitButton = getByText(translateRaw('NEXT'));
    expect(submitButton).toBeDefined();
    await act(() => fireEvent.click(submitButton));

    await waitFor(() =>
      expect(mockStore.getActions()).toContainEqual(
        fetchAddresses({
          wallet: {
            walletType: WalletType.MNEMONIC,
            mnemonicPhrase: fMnemonicPhrase,
            passphrase: 'password'
          },
          path: DEFAULT_ETH,
          limit: 10,
          offset: 0
        })
      )
    );
  });

  it('shows the fetched addresses', async () => {
    const mockStore = createMockStore({
      accounts: {
        addresses: [
          {
            address: '0x2a8aBa3dDD5760EE7BbF03d2294BD6134D0f555f',
            dPath: "m/44'/60'/0'/0/0",
            index: 0
          }
        ]
      }
    });

    const { getByText, getByTestId } = getComponent(mockStore);
    const mnemonicButton = getByTestId('select-MNEMONIC');
    expect(mnemonicButton).toBeDefined();
    fireEvent.click(mnemonicButton);

    const address = '0x2a8aBa3dDD5760EE7BbF03d2294BD6134D0f555f';
    await waitFor(() => expect(getByText(address)).toBeDefined());
    fireEvent.click(getByTestId(`checkbox-${address}`));

    fireEvent.click(getByText(translateRaw('VERIFY_ACCOUNT')));

    expect(mockStore.getActions()).toContainEqual(
      fetchAccounts([
        {
          walletType: WalletType.MNEMONIC,
          mnemonicPhrase: '',
          passphrase: '',
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
    const mockStore = createMockStore({
      accounts: {
        addresses: [],
        fetchError: 'error'
      }
    });

    const { getByText, getByTestId } = getComponent(mockStore);
    const mnemonicButton = getByTestId('select-MNEMONIC');
    expect(mnemonicButton).toBeDefined();
    fireEvent.click(mnemonicButton);

    await waitFor(() => expect(getByText('error')).toBeDefined());
  });
});

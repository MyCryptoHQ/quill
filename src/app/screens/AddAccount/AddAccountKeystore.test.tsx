import type { EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router';
import configureStore from 'redux-mock-store';

import { fetchAccounts } from '@common/store';
import { translateRaw } from '@common/translate';
import { fKeystore, fKeystorePassword } from '@fixtures';
import { AddAccount } from '@screens';
import type { ApplicationState } from '@store';
import type { DeepPartial } from '@types';
import { WalletType } from '@types';

const createMockStore = configureStore<DeepPartial<ApplicationState>>();
const mockStore = createMockStore({
  accounts: { accounts: [], addresses: [], isFetching: false, fetchError: undefined }
});

const getComponent = (store: EnhancedStore<DeepPartial<ApplicationState>> = mockStore) => {
  return render(
    <Router>
      <Provider store={store}>
        <AddAccount walletType={WalletType.KEYSTORE} />
      </Provider>
    </Router>
  );
};

describe('AddAccountKeystore', () => {
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

    const submitButton = getByText(translateRaw('VERIFY_ACCOUNT'));
    expect(submitButton).toBeDefined();
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(mockStore.getActions()).toContainEqual(
        fetchAccounts([
          {
            walletType: WalletType.KEYSTORE,
            keystore: fKeystore,
            password: fKeystorePassword
          }
        ])
      )
    );
  });

  it('can submit keystore file via drag and drop', async () => {
    const { container, getByText, getByTestId } = getComponent();

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

    const submitButton = getByText(translateRaw('VERIFY_ACCOUNT'));
    expect(submitButton).toBeDefined();
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(mockStore.getActions()).toContainEqual(
        fetchAccounts([
          {
            walletType: WalletType.KEYSTORE,
            keystore: fKeystore,
            password: fKeystorePassword
          }
        ])
      )
    );
  });

  it('shows keystore form validation', async () => {
    const { getByText } = getComponent();

    const submitButton = getByText(translateRaw('VERIFY_ACCOUNT'));
    expect(submitButton).toBeDefined();
    fireEvent.click(submitButton);

    await waitFor(() => expect(getByText(translateRaw('KEYSTORE_EMPTY'))).toBeDefined());
  });

  it('shows keystore file error', async () => {
    const { getByText, getByTestId, container } = getComponent();

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
});

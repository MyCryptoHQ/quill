import { DEFAULT_ETH } from '@mycrypto/wallets';
import type { EnhancedStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router';
import configureStore from 'redux-mock-store';

import { fetchAccounts, fetchAddresses } from '@common/store';
import { translateRaw } from '@common/translate';
import { fMnemonicPhrase } from '@fixtures';
import { AddAccount } from '@screens';
import type { ApplicationState } from '@store';
import { WalletType } from '@types';
import type { DeepPartial } from '@types';

const createMockStore = configureStore<DeepPartial<ApplicationState>>();
const mockStore = createMockStore({
  accounts: { accounts: [], addresses: [], isFetching: false, fetchError: undefined }
});

const getComponent = (store: EnhancedStore<DeepPartial<ApplicationState>> = mockStore) => {
  return render(
    <Router>
      <Provider store={store}>
        <AddAccount walletType={WalletType.MNEMONIC} />
      </Provider>
    </Router>
  );
};

describe('AddAccountMnemonic', () => {
  it('can submit mnemonic', async () => {
    const { getByLabelText, getByText, getByTestId } = getComponent();

    const mnemonicInput = getByTestId('mnemonic-input');
    expect(mnemonicInput).toBeDefined();
    fireEvent.change(mnemonicInput, { target: { value: fMnemonicPhrase } });

    const passwordInput = getByLabelText(translateRaw('MNEMONIC_PASSWORD'));
    fireEvent.change(passwordInput, { target: { value: 'password' } });

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
          index: 0
        }
      ])
    );
  });

  it('shows mnemonic form validation', async () => {
    const { getByText } = getComponent();

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

    const { getByText } = getComponent(mockStore);

    await waitFor(() => expect(getByText('error')).toBeDefined());
  });
});

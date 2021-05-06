import { DEFAULT_ETH, getFullPath } from '@mycrypto/wallets';
import type { EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router';
import configureStore from 'redux-mock-store';

import { addSavedAccounts, setAccountsToAdd } from '@common/store';
import { translateRaw } from '@common/translate';
import { fAccount } from '@fixtures';
import type { ApplicationState } from '@store';
import type { DeepPartial } from '@types';
import { WalletType } from '@types';

import { AddAccountBackup } from './AddAccountBackup';

const createMockStore = configureStore<DeepPartial<ApplicationState>>();

const getComponent = (store: EnhancedStore<DeepPartial<ApplicationState>> = createMockStore()) => {
  return render(
    <Router>
      <Provider store={store}>
        <AddAccountBackup />
      </Provider>
    </Router>
  );
};

describe('AddAccountBackup', () => {
  it('shows the address of the account to add', () => {
    const store = createMockStore({
      accounts: {
        accountsToAdd: [
          {
            walletType: WalletType.PRIVATE_KEY,
            address: fAccount.address
          }
        ]
      }
    });
    const { getByText } = getComponent(store);

    expect(getByText(fAccount.address)).toBeDefined();
  });

  it('shows the derivation path for mnemonic phrases', () => {
    const store = createMockStore({
      accounts: {
        accountsToAdd: [
          {
            walletType: WalletType.MNEMONIC,
            address: fAccount.address,
            path: DEFAULT_ETH,
            index: 1
          }
        ]
      }
    });
    const { getByText } = getComponent(store);

    expect(getByText(fAccount.address)).toBeDefined();
    expect(getByText(getFullPath(DEFAULT_ETH, 1))).toBeDefined();
  });

  it('adds accounts', () => {
    const store = createMockStore({
      accounts: {
        accountsToAdd: [
          {
            walletType: WalletType.PRIVATE_KEY,
            address: fAccount.address
          }
        ]
      }
    });
    const { getByText, getByTestId } = getComponent(store);

    const button = getByText(translateRaw('CONTINUE_ADD_ACCOUNT'));
    fireEvent.click(button);

    expect(store.getActions()).toContainEqual(addSavedAccounts(true));

    const checkbox = getByTestId('toggle-persistence');
    fireEvent.click(checkbox);
    fireEvent.click(button);

    expect(store.getActions()).toContainEqual(addSavedAccounts(false));
  });

  it.todo('prints a paper wallet');

  it('clears the state on unmount', async () => {
    const store = createMockStore({
      accounts: {
        accountsToAdd: [
          {
            walletType: WalletType.PRIVATE_KEY,
            address: fAccount.address
          }
        ]
      }
    });
    const { unmount } = getComponent(store);

    unmount();

    expect(store.getActions()).toContainEqual(setAccountsToAdd([]));
  });
});

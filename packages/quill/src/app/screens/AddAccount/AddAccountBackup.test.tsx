import { DEFAULT_ETH, getFullPath } from '@mycrypto/wallets';
import { addSavedAccounts, translateRaw, WalletType } from '@quill/common';
import type { DeepPartial } from '@quill/common';
import type { EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { toPng } from 'html-to-image';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router';
import configureStore from 'redux-mock-store';
import { ThemeProvider } from 'styled-components';

import { fAccount, fMnemonicPhrase, fPrivateKey } from '@fixtures';
import type { ApplicationState } from '@store';
import { theme } from '@theme';

import { AddAccountBackup } from './AddAccountBackup';

jest.mock('html-to-image', () => ({
  toPng: jest.fn().mockImplementation(async () => 'foo bar')
}));

const createMockStore = configureStore<DeepPartial<ApplicationState>>();

const getComponent = (store: EnhancedStore<DeepPartial<ApplicationState>> = createMockStore()) => {
  return render(
    <ThemeProvider theme={theme}>
      <Router>
        <Provider store={store}>
          <AddAccountBackup
            onNext={jest.fn()}
            onPrevious={jest.fn()}
            onReset={jest.fn()}
            flowHeader={<></>}
          />
        </Provider>
      </Router>
    </ThemeProvider>
  );
};

describe('AddAccountBackup', () => {
  it('shows the address of the account to add', () => {
    const store = createMockStore({
      accounts: {
        add: {
          accounts: [
            {
              walletType: WalletType.PRIVATE_KEY,
              address: fAccount.address
            }
          ],
          secret: fPrivateKey
        }
      }
    });
    const { getAllByText } = getComponent(store);

    expect(getAllByText(fAccount.address)).toBeDefined();
  });

  it('shows the derivation path for mnemonic phrases', () => {
    const store = createMockStore({
      accounts: {
        add: {
          accounts: [
            {
              walletType: WalletType.MNEMONIC,
              address: fAccount.address,
              path: DEFAULT_ETH,
              index: 1
            }
          ],
          secret: fMnemonicPhrase
        }
      }
    });
    const { getAllByText } = getComponent(store);

    expect(getAllByText(fAccount.address)).toBeDefined();
    expect(getAllByText(getFullPath(DEFAULT_ETH, 1))).toBeDefined();
  });

  it('adds accounts', () => {
    const store = createMockStore({
      accounts: {
        add: {
          accounts: [
            {
              walletType: WalletType.PRIVATE_KEY,
              address: fAccount.address
            }
          ],
          secret: fPrivateKey
        }
      }
    });
    const { getByText, getByTestId } = getComponent(store);

    const button = getByText(
      translateRaw('CONTINUE_ADD_ACCOUNT', { $type: translateRaw('PRIVATE_KEY') })
    );
    fireEvent.click(button);

    expect(store.getActions()).toContainEqual(addSavedAccounts(true));

    const checkbox = getByTestId('toggle-persistence');
    fireEvent.click(checkbox);
    fireEvent.click(button);

    expect(store.getActions()).toContainEqual(addSavedAccounts(false));
  });

  it('generates a paper wallet', async () => {
    const { getByTestId } = getComponent(
      createMockStore({
        accounts: {
          add: {
            accounts: [
              {
                walletType: WalletType.PRIVATE_KEY,
                address: fAccount.address
              }
            ],
            secret: fPrivateKey
          }
        }
      })
    );

    await waitFor(() => expect(toPng).toHaveBeenCalled());
    expect(getByTestId('download-link').getAttribute('href')).toBe('foo bar');
  });
});

import type { EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import type { ApplicationState } from '@app/store';
import { sign } from '@common/store';
import { translateRaw } from '@common/translate';
import {
  fAccount,
  fAccounts,
  fKeystore,
  fKeystorePassword,
  fMnemonicPhrase,
  fPrivateKey,
  fTxRequest,
  getTransactionRequest
} from '@fixtures';
import type { DeepPartial, IAccount } from '@types';
import { WalletType } from '@types';
import { makeQueueTx, makeTx } from '@utils';

import { SignTransaction } from '../SignTransaction';

const createMockStore = configureStore<DeepPartial<ApplicationState>>();

function getComponent(store: EnhancedStore<DeepPartial<ApplicationState>>) {
  return render(
    <Router>
      <Provider store={store}>
        <SignTransaction />
      </Provider>
    </Router>
  );
}

const getComponentWithStore = (account: IAccount = fAccount, error: string = undefined) => {
  const transactionRequest = makeQueueTx(getTransactionRequest(account.address));
  const mockStore = createMockStore({
    accounts: {
      accounts: [account]
    },
    transactions: {
      queue: [transactionRequest],
      currentTransaction: transactionRequest
    },
    signing: {
      isSigning: false,
      error
    }
  });

  const component = getComponent(mockStore);
  return { component, mockStore };
};

describe('SignTransaction', () => {
  it('renders', async () => {
    const {
      component: { getByText }
    } = getComponentWithStore();
    expect(getByText(translateRaw('SIGN_TX')).textContent).toBeDefined();
  });

  it('can accept tx with private key', async () => {
    const {
      component: { getByText, container },
      mockStore
    } = getComponentWithStore();
    await waitFor(() => expect(getByText(translateRaw('SIGN_TX'))?.textContent).toBeDefined());

    const privkeyInput = container.querySelector('input[name="privateKey"]');
    expect(privkeyInput).toBeDefined();
    fireEvent.change(privkeyInput, { target: { value: fPrivateKey } });

    const acceptButton = getByText(translateRaw('SIGN_TX'));
    fireEvent.click(acceptButton);

    await waitFor(() =>
      expect(mockStore.getActions()).toContainEqual(
        sign({
          wallet: {
            walletType: WalletType.PRIVATE_KEY,
            privateKey: fPrivateKey
          },
          tx: makeTx(fTxRequest)
        })
      )
    );
  });

  it('shows private key Redux error', async () => {
    const {
      component: { getByText }
    } = getComponentWithStore(fAccount, 'error');

    await waitFor(() => expect(getByText('error', { exact: false })).toBeDefined());
  });

  it('can accept tx with keystore', async () => {
    const {
      component: { getByText, container, getByTestId },
      mockStore
    } = getComponentWithStore(fAccounts[3]);
    await waitFor(() => expect(getByText(translateRaw('SIGN_TX'))?.textContent).toBeDefined());

    const keystoreBlob = new Blob([fKeystore], { type: 'application/json' });
    const keystoreFile = new File([keystoreBlob], 'keystore.json');
    keystoreFile.text = async () => fKeystore;

    const keystoreInput = getByTestId('file-upload');
    expect(keystoreInput).toBeDefined();
    fireEvent.change(keystoreInput, { target: { files: [keystoreFile] } });

    const passwordInput = container.querySelector('input[name="password"]');
    expect(passwordInput).toBeDefined();
    fireEvent.change(passwordInput, { target: { value: fKeystorePassword } });

    const acceptButton = getByText(translateRaw('SIGN_TX'));
    await waitFor(() => fireEvent.click(acceptButton));

    await waitFor(() =>
      expect(mockStore.getActions()).toContainEqual(
        sign({
          wallet: {
            walletType: WalletType.KEYSTORE,
            keystore: fKeystore,
            password: fKeystorePassword
          },
          tx: makeTx(fTxRequest)
        })
      )
    );
  });

  it('shows keystore file error', async () => {
    const {
      component: { getByText, container, getByTestId }
    } = getComponentWithStore(fAccounts[3]);
    await waitFor(() => expect(getByText(translateRaw('SIGN_TX'))?.textContent).toBeDefined());

    const keystoreBlob = new Blob([fKeystore], { type: 'application/json' });
    const keystoreFile = new File([keystoreBlob], 'keystore.json');
    keystoreFile.text = async () => {
      throw new Error('error');
    };

    const keystoreInput = getByTestId('file-upload');
    expect(keystoreInput).toBeDefined();
    fireEvent.change(keystoreInput, { target: { files: [keystoreFile] } });

    const passwordInput = container.querySelector('input[name="password"]');
    expect(passwordInput).toBeDefined();
    fireEvent.change(passwordInput, { target: { value: fKeystorePassword } });

    const acceptButton = getByText(translateRaw('SIGN_TX'));
    fireEvent.click(acceptButton);

    await waitFor(() => expect(getByText('error', { exact: false })).toBeDefined());
  });

  it('shows keystore Redux error', async () => {
    const {
      component: { getByText }
    } = getComponentWithStore(fAccounts[3], 'error');

    await waitFor(() => expect(getByText('error', { exact: false })).toBeDefined());
  });

  it('can accept tx with mnemonic', async () => {
    const {
      component: { getByText, getByLabelText, getByTestId },
      mockStore
    } = getComponentWithStore(fAccounts[1]);
    const acceptButton = getByText(translateRaw('SIGN_TX'));
    expect(acceptButton.textContent).toBeDefined();

    const mnemonicInput = getByTestId('mnemonic-input');
    expect(mnemonicInput).toBeDefined();
    fireEvent.change(mnemonicInput, { target: { value: fMnemonicPhrase } });

    const passwordInput = getByLabelText(translateRaw('MNEMONIC_PASSWORD'));
    fireEvent.change(passwordInput, { target: { value: 'password' } });

    fireEvent.click(acceptButton);

    const transactionRequest = getTransactionRequest(fAccounts[1].address);
    await waitFor(() =>
      expect(mockStore.getActions()).toContainEqual(
        sign({
          wallet: {
            walletType: WalletType.MNEMONIC,
            mnemonicPhrase: fMnemonicPhrase,
            passphrase: 'password',
            path: fAccounts[1].dPath,
            index: fAccounts[1].index
          },
          tx: makeTx(transactionRequest.request)
        })
      )
    );
  });

  it('shows mnemonic Redux error', async () => {
    const {
      component: { getByText }
    } = getComponentWithStore(fAccounts[1], 'error');

    await waitFor(() => expect(getByText('error', { exact: false })).toBeDefined());
  });
});

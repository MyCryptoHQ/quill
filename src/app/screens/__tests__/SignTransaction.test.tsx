import React from 'react';

import { fireEvent, render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';

import { ApplicationState, denyCurrentTransaction, sign } from '@app/store';
import { ipcBridgeRenderer } from '@bridge';
import { fAccount, fAccounts, fMnemonicPhrase, fTxRequest, getTransactionRequest } from '@fixtures';

import { SignTransaction } from '../SignTransaction';
import configureStore from 'redux-mock-store';
import { DeepPartial, EnhancedStore } from '@reduxjs/toolkit';
import { IAccount, WalletType } from '@types';
import { makeTx } from '@utils';

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

const getComponentWithStore = (account: IAccount = fAccount) => {
  const transactionRequest = getTransactionRequest(account.address);
  const mockStore = createMockStore({
    accounts: {
      // @ts-expect-error Brand bug with DeepPartial
      accounts: [account]
    },
    transactions: {
      queue: [transactionRequest]
    }
  });

  const component = getComponent(mockStore);
  return { component, mockStore };
};

describe('SignTransaction', () => {
  it('renders', async () => {
    const { component: { getByText } } = getComponentWithStore();
    expect(getByText('Accept').textContent).toBeDefined();
  });

  it('can accept tx with private key', async () => {
    const { component: { getByText, getByLabelText }, mockStore } = getComponentWithStore();
    await waitFor(() => expect(getByText('Accept')?.textContent).toBeDefined());

    const privkeyInput = getByLabelText('Private Key');
    expect(privkeyInput).toBeDefined();
    fireEvent.change(privkeyInput, { target: { value: 'privkey' } });

    const acceptButton = getByText('Accept');
    fireEvent.click(acceptButton);

    expect(mockStore.getActions()).toContainEqual(sign({
      wallet: {
        walletType: WalletType.PRIVATE_KEY,
        privateKey: 'privkey'
      },
      tx: makeTx(fTxRequest)
    }))
  });

  it('can accept tx with mnemonic', async () => {
    const { component: { getByText, getByLabelText }, mockStore } = getComponentWithStore(fAccounts[1]);
    const acceptButton = getByText('Accept');
    expect(acceptButton.textContent).toBeDefined();

    const mnemonicInput = getByLabelText('Mnemonic Phrase');
    expect(mnemonicInput).toBeDefined();
    fireEvent.change(mnemonicInput, { target: { value: fMnemonicPhrase } });

    const passwordInput = getByLabelText('Password');
    fireEvent.change(passwordInput, { target: { value: 'password' } });

    fireEvent.click(acceptButton);

    const transactionRequest = getTransactionRequest(fAccounts[1].address);
    expect(mockStore.getActions()).toContainEqual(sign({
      wallet: {
        walletType: WalletType.MNEMONIC,
        mnemonicPhrase: fMnemonicPhrase,
        passphrase: 'password',
        path: fAccounts[1].dPath
      },
      tx: makeTx(transactionRequest)
    }))
  });

  it('can accept tx with a persistent private key', async () => {
    const { component: { getByText } } = getComponentWithStore();
    const acceptButton = getByText('Accept');
    expect(acceptButton.textContent).toBeDefined();

    fireEvent.click(acceptButton);

    expect(ipcBridgeRenderer.crypto.invoke).toHaveBeenCalled();

    await waitFor(() =>
      expect(ipcBridgeRenderer.api.sendResponse).toHaveBeenCalledWith(
        expect.objectContaining({ id: 4 })
      )
    );
  });

  it('can deny tx', async () => {
    const { component: { getByText }, mockStore } = getComponentWithStore();
    const denyButton = getByText('Deny');
    expect(denyButton.textContent).toBeDefined();

    fireEvent.click(denyButton);

    expect(mockStore.getActions()).toContainEqual(denyCurrentTransaction());
  });
});

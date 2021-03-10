import React from 'react';

import { DeepPartial, EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { ApplicationState, denyCurrentTransaction, sign } from '@app/store';
import { fAccount, fAccounts, getTransactionRequest } from '@fixtures';
import { IAccount } from '@types';
import { makeQueueTx, makeTx } from '@utils';

import { Transaction } from '../Transaction';

const createMockStore = configureStore<DeepPartial<ApplicationState>>();

function getComponent(store: EnhancedStore<DeepPartial<ApplicationState>>) {
  return render(
    <Router>
      <Provider store={store}>
        <Transaction />
      </Provider>
    </Router>
  );
}

const getComponentWithStore = (account: IAccount = fAccount) => {
  const transactionRequest = makeQueueTx(getTransactionRequest(account.address));
  const mockStore = createMockStore({
    accounts: {
      // @ts-expect-error Brand bug with DeepPartial
      accounts: [account]
    },
    transactions: {
      // @ts-expect-error Brand bug with DeepPartial
      queue: [transactionRequest],
      // @ts-expect-error Brand bug with DeepPartial
      currentTransaction: transactionRequest
    }
  });

  const component = getComponent(mockStore);
  return { component, mockStore };
};

describe('Transaction', () => {
  it('renders', async () => {
    const {
      component: { getByText }
    } = getComponentWithStore();
    expect(getByText('This transaction is waiting on action').textContent).toBeDefined();
    expect(getByText('Gas Limit', { exact: false }).textContent).toBeDefined();
    expect(getByText('21000', { exact: false }).textContent).toBeDefined();
  });

  it('can accept tx with a persistent private key', async () => {
    const {
      component: { getByText },
      mockStore
    } = getComponentWithStore(fAccounts[2]);
    const acceptButton = getByText('Approve Transaction');
    expect(acceptButton.textContent).toBeDefined();

    fireEvent.click(acceptButton);

    const transactionRequest = getTransactionRequest(fAccounts[2].address);
    expect(mockStore.getActions()).toContainEqual(
      sign({
        wallet: {
          persistent: true,
          uuid: fAccounts[2].uuid
        },
        tx: makeTx(transactionRequest)
      })
    );
  });

  it('can deny tx', async () => {
    const {
      component: { getByText },
      mockStore
    } = getComponentWithStore();
    const denyButton = getByText('Deny Transaction');
    expect(denyButton.textContent).toBeDefined();

    fireEvent.click(denyButton);

    expect(mockStore.getActions()).toContainEqual(denyCurrentTransaction());
  });
});

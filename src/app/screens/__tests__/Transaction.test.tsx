import React from 'react';

import { DeepPartial, EnhancedStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { ApplicationState } from '@app/store';
import { fAccount, getTransactionRequest } from '@fixtures';
import { IAccount } from '@types';
import { makeQueueTx } from '@utils';

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
  return component;
};

describe('Transaction', () => {
  it('renders', async () => {
    const { getByText } = getComponentWithStore();
    expect(getByText('This transaction is waiting on action').textContent).toBeDefined();
    expect(getByText('Gas Limit', { exact: false }).textContent).toBeDefined();
    expect(getByText('307835323038', { exact: false }).textContent).toBeDefined();
  });
});

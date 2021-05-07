import type { EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import type { ApplicationState } from '@app/store';
import { denyCurrentTransaction, sign } from '@common/store';
import { translateRaw } from '@common/translate';
import { fAccount, fAccounts, getTransactionRequest } from '@fixtures';
import type { DeepPartial, IAccount, TSignTransaction } from '@types';
import { TxResult } from '@types';
import { makeHistoryTx, makeQueueTx, makeTx } from '@utils';

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

const getComponentWithStore = (account: IAccount = fAccount, tx?: Partial<TSignTransaction[0]>) => {
  const transactionRequest = makeQueueTx(getTransactionRequest(account.address, tx));
  const mockStore = createMockStore({
    accounts: {
      accounts: [account]
    },
    transactions: {
      queue: [transactionRequest],
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
    expect(getByText('Data', { exact: false }).textContent).toBeDefined();
    expect(getByText('(none)', { exact: false }).textContent).toBeDefined();
  });

  it('renders data block', async () => {
    const {
      component: { getByText }
    } = getComponentWithStore(fAccount, { data: '0x123' });
    expect(getByText('0x123', { exact: false }).textContent).toBeDefined();
  });

  it('can accept tx with a persistent private key', async () => {
    const {
      component: { getByText },
      mockStore
    } = getComponentWithStore(fAccounts[2]);
    const acceptButton = getByText(translateRaw('APPROVE_TX'));
    expect(acceptButton.textContent).toBeDefined();

    fireEvent.click(acceptButton);

    const transactionRequest = getTransactionRequest(fAccounts[2].address);
    expect(mockStore.getActions()).toContainEqual(
      sign({
        wallet: {
          persistent: true,
          uuid: fAccounts[2].uuid
        },
        tx: makeTx(transactionRequest.request)
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

  it('renders approved banner', async () => {
    const queueTx = makeQueueTx(getTransactionRequest(fAccount.address));
    const store = createMockStore({
      accounts: { accounts: [fAccount] },
      transactions: { queue: [], currentTransaction: makeHistoryTx(queueTx, TxResult.APPROVED) }
    });
    const { getByText } = getComponent(store);
    expect(getByText(translateRaw('TX_RESULT_APPROVED_LABEL')).textContent).toBeDefined();
  });

  it('renders adjusted nonce banner', async () => {
    const queueTx = makeQueueTx(getTransactionRequest(fAccount.address));
    const store = createMockStore({
      accounts: { accounts: [fAccount] },
      transactions: {
        queue: [queueTx],
        currentTransaction: { ...queueTx, adjustedNonce: true }
      }
    });
    const { getByText } = getComponent(store);
    expect(getByText(translateRaw('NONCE_CHANGED')).textContent).toBeDefined();
  });

  it('renders nonce conflict banner', async () => {
    const queueTx = makeQueueTx(getTransactionRequest(fAccount.address));
    const store = createMockStore({
      accounts: { accounts: [fAccount] },
      transactions: {
        queue: [queueTx, { ...queueTx, uuid: 'tx2' }],
        currentTransaction: queueTx
      }
    });
    const { getByText } = getComponent(store);
    expect(getByText(translateRaw('NONCE_CONFLICT_IN_QUEUE')).textContent).toBeDefined();
  });
});

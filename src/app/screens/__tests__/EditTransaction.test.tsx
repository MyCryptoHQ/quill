import type { EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import type { ApplicationState } from '@app/store';
import { update } from '@common/store/transactions.slice';
import { translateRaw } from '@common/translate';
import { fAccount, getTransactionRequest } from '@fixtures';
import type { DeepPartial, IAccount, TSignTransaction } from '@types';
import { TxResult } from '@types';
import { makeHistoryTx, makeQueueTx } from '@utils';

import { EditTransaction } from '../EditTransaction';

const createMockStore = configureStore<DeepPartial<ApplicationState>>();

function getComponent(store: EnhancedStore<DeepPartial<ApplicationState>>) {
  return render(
    <Router>
      <Provider store={store}>
        <EditTransaction />
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

describe('EditTransaction', () => {
  it('renders', async () => {
    const {
      component: { getByText, getByDisplayValue }
    } = getComponentWithStore();
    expect(getByText('This transaction is waiting on action').textContent).toBeDefined();
    expect(getByText('Gas Limit', { exact: false }).textContent).toBeDefined();
    expect(getByDisplayValue('21000', { exact: false }).textContent).toBeDefined();
  });

  it('updates transaction based on form values', async () => {
    const transactionRequest = makeQueueTx(getTransactionRequest(fAccount.address));
    const mockStore = createMockStore({
      accounts: {
        accounts: [fAccount]
      },
      transactions: {
        queue: [transactionRequest],
        currentTransaction: transactionRequest
      }
    });
    const { getByText, container } = getComponent(mockStore);
    const gasLimit = container.querySelector('input[name="gasLimit"]');
    expect(gasLimit).toBeDefined();
    fireEvent.change(gasLimit, { target: { value: 23000 } });

    const saveButton = getByText(translateRaw('SAVE_SETTINGS'));
    expect(saveButton).toBeDefined();
    fireEvent.click(saveButton);

    await waitFor(() =>
      expect(mockStore.getActions()).toContainEqual(
        update({
          ...transactionRequest,
          tx: { ...transactionRequest.tx, gasLimit: '0x59d8' },
          adjustedNonce: false,
          userEdited: true
        })
      )
    );
  });

  it('doesnt update transaction if form is invalid', async () => {
    const {
      component: { getByText, container },
      mockStore
    } = getComponentWithStore();
    const gasLimit = container.querySelector('input[name="gasLimit"]');
    expect(gasLimit).toBeDefined();
    fireEvent.change(gasLimit, { target: { value: 'blabla' } });

    const saveButton = getByText(translateRaw('SAVE_SETTINGS'));
    expect(saveButton).toBeDefined();
    fireEvent.click(saveButton);

    await waitFor(() => expect(mockStore.getActions()).toHaveLength(0));
  });

  it('renders data block', async () => {
    const {
      component: { getByText }
    } = getComponentWithStore(fAccount, { data: '0x123' });
    expect(getByText('0x123', { exact: false }).textContent).toBeDefined();
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

  it('renders nonce out of order banner', async () => {
    const queueTx = makeQueueTx(getTransactionRequest(fAccount.address));
    const store = createMockStore({
      accounts: { accounts: [fAccount] },
      transactions: {
        queue: [queueTx, { ...queueTx, uuid: 'tx2', tx: { ...queueTx.tx, nonce: '0x5' } }],
        currentTransaction: queueTx
      }
    });
    const { getByText } = getComponent(store);
    expect(getByText(translateRaw('NONCE_OUT_OF_ORDER')).textContent).toBeDefined();
  });
});

import type { EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import type { ApplicationState } from '@app/store';
import { update } from '@common/store/transactions.slice';
import { translateRaw } from '@common/translate';
import { fAccount, getTransactionRequest } from '@fixtures';
import type { DeepPartial } from '@types';
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

const transactionRequest = makeQueueTx(getTransactionRequest(fAccount.address));

describe('EditTransaction', () => {
  it('renders', async () => {
    const mockStore = createMockStore({
      accounts: {
        accounts: [fAccount]
      },
      transactions: {
        queue: [transactionRequest],
        currentTransaction: transactionRequest
      }
    });
    const { getByText, getByDisplayValue } = getComponent(mockStore);
    expect(getByText('This transaction is waiting on action').textContent).toBeDefined();
    expect(getByText('Gas Limit', { exact: false }).textContent).toBeDefined();
    expect(getByDisplayValue('21000', { exact: false }).textContent).toBeDefined();
  });

  it('updates transaction based on form values', async () => {
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
    fireEvent.change(gasLimit, { target: { value: 'blabla' } });

    const saveButton = getByText(translateRaw('SAVE_SETTINGS'));
    expect(saveButton).toBeDefined();
    fireEvent.click(saveButton);

    // Hack to allow for async code to execute before we wait
    await new Promise((resolve) => setTimeout(resolve, 1));
    await waitFor(() => expect(mockStore.getActions()).toHaveLength(0));
  });

  it('renders data block', async () => {
    const request = makeQueueTx(getTransactionRequest(fAccount.address, { data: '0x1234' }));
    const mockStore = createMockStore({
      accounts: {
        accounts: [fAccount]
      },
      transactions: {
        queue: [request],
        currentTransaction: request
      }
    });
    const { getByText } = getComponent(mockStore);
    expect(getByText('0x1234', { exact: false }).textContent).toBeDefined();
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

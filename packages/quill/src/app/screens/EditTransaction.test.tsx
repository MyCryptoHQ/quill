import { makeHistoryTx, makeQueueTx, translateRaw, TxResult, update } from '@quill/common';
import type { DeepPartial } from '@quill/common';
import type { EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { replace } from 'connected-react-router';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { ROUTE_PATHS } from '@app/routing';
import type { ApplicationState } from '@app/store';
import { fAccount, getEIP1559TransactionRequest, getTransactionRequest } from '@fixtures';

import { EditTransaction } from './EditTransaction';

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
        history: [],
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
        history: [],
        queue: [transactionRequest],
        currentTransaction: transactionRequest
      }
    });
    const { getByText, container } = getComponent(mockStore);
    const gasLimit = container.querySelector('input[name="gasLimit"]');
    expect(gasLimit).toBeDefined();
    fireEvent.change(gasLimit, { target: { value: 23000 } });

    const saveButton = getByText(translateRaw('SAVE_TX_DETAILS'));
    expect(saveButton).toBeDefined();
    fireEvent.click(saveButton);

    await waitFor(() =>
      expect(mockStore.getActions()).toContainEqual(
        update({
          ...transactionRequest,
          tx: { ...transactionRequest.tx, gasLimit: '0x59d8' },
          userEdited: true
        })
      )
    );
  });

  it('updates transaction based on EIP1559 form values', async () => {
    const tx = makeQueueTx(getEIP1559TransactionRequest(fAccount.address));
    const mockStore = createMockStore({
      accounts: {
        accounts: [fAccount]
      },
      transactions: {
        history: [],
        queue: [tx],
        currentTransaction: tx
      }
    });
    const { getByText, container } = getComponent(mockStore);
    const maxFeePerGas = container.querySelector('input[name="maxFeePerGas"]');
    expect(maxFeePerGas).toBeDefined();
    fireEvent.change(maxFeePerGas, { target: { value: 200 } });

    const saveButton = getByText(translateRaw('SAVE_TX_DETAILS'));
    expect(saveButton).toBeDefined();
    fireEvent.click(saveButton);

    await waitFor(() =>
      expect(mockStore.getActions()).toContainEqual(
        update({
          ...tx,
          tx: { ...tx.tx, maxFeePerGas: '0x2e90edd000' },
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
        history: [],
        queue: [transactionRequest],
        currentTransaction: transactionRequest
      }
    });
    const { getByText, container } = getComponent(mockStore);
    const gasLimit = container.querySelector('input[name="gasLimit"]');
    expect(gasLimit).toBeDefined();
    fireEvent.change(gasLimit, { target: { value: 'blabla' } });

    const saveButton = getByText(translateRaw('SAVE_TX_DETAILS'));
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
        history: [],
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
      transactions: {
        history: [],
        queue: [],
        currentTransaction: makeHistoryTx(queueTx, TxResult.APPROVED)
      }
    });
    const { getByText } = getComponent(store);
    expect(getByText(translateRaw('TX_RESULT_APPROVED_LABEL')).textContent).toBeDefined();
  });

  it('renders nonce conflict in queue banner', async () => {
    const queueTx = makeQueueTx(getTransactionRequest(fAccount.address));
    const store = createMockStore({
      accounts: { accounts: [fAccount] },
      transactions: {
        history: [],
        queue: [queueTx, { ...queueTx, uuid: 'tx2' }],
        currentTransaction: queueTx
      }
    });
    const { getByText } = getComponent(store);
    expect(
      getByText('The selected nonce is used by another transaction in your queue.', {
        exact: false
      }).textContent
    ).toBeDefined();
  });

  it('renders nonce conflict banner', async () => {
    const queueTx = makeQueueTx(getTransactionRequest(fAccount.address));
    const historyTx = makeHistoryTx(queueTx, TxResult.APPROVED);
    const currentTx = { ...queueTx, uuid: 'tx2' };
    const store = createMockStore({
      accounts: { accounts: [fAccount] },
      transactions: {
        history: [historyTx],
        queue: [currentTx],
        currentTransaction: currentTx
      }
    });
    const { getByText } = getComponent(store);
    expect(
      getByText('The selected nonce has been used in another transaction.', { exact: false })
        .textContent
    ).toBeDefined();
  });

  it('renders nonce out of order banner', async () => {
    const queueTx = makeQueueTx(getTransactionRequest(fAccount.address));
    const store = createMockStore({
      accounts: { accounts: [fAccount] },
      transactions: {
        history: [],
        queue: [queueTx, { ...queueTx, uuid: 'tx2', tx: { ...queueTx.tx, nonce: '0x5' } }],
        currentTransaction: queueTx
      }
    });
    const { getByText } = getComponent(store);
    expect(getByText(translateRaw('NONCE_OUT_OF_ORDER')).textContent).toBeDefined();
  });

  it('allows a user to cancel editing a tx', async () => {
    const tx = makeQueueTx(getEIP1559TransactionRequest(fAccount.address));
    const mockStore = createMockStore({
      accounts: {
        accounts: [fAccount]
      },
      transactions: {
        history: [],
        queue: [tx],
        currentTransaction: tx
      }
    });
    const { getByText } = getComponent(mockStore);

    const cancelButton = getByText(translateRaw('CANCEL'));
    expect(cancelButton).toBeDefined();
    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockStore.getActions()).toContainEqual(replace(ROUTE_PATHS.TX)));
  });
});

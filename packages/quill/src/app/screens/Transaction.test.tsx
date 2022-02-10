import {
  denyCurrentTransaction,
  makeHistoryTx,
  makeQueueTx,
  makeTx,
  sign,
  translateRaw,
  TxResult
} from '@quill/common';
import type { DeepPartial, IAccount, TSignTransaction } from '@quill/common';
import type { EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, render } from '@testing-library/react';
import { push } from 'connected-react-router';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { ThemeProvider } from 'styled-components';

import { ROUTE_PATHS } from '@app/routing';
import type { ApplicationState } from '@app/store';
import { theme } from '@app/theme';
import {
  fAccount,
  fAccounts,
  fSignedTx,
  fTxRequestEIP1559,
  getEIP1559TransactionRequest,
  getTransactionRequest
} from '@fixtures';

import { Transaction } from './Transaction';

const createMockStore = configureStore<DeepPartial<ApplicationState>>();

function getComponent(store: EnhancedStore<DeepPartial<ApplicationState>>) {
  return render(
    <ThemeProvider theme={theme}>
      <Router>
        <Provider store={store}>
          <Transaction />
        </Provider>
      </Router>
    </ThemeProvider>
  );
}

const getComponentWithStore = (account: IAccount = fAccount, tx?: Partial<TSignTransaction[0]>) => {
  const transactionRequest = makeQueueTx(getTransactionRequest(account.address, tx));
  const mockStore = createMockStore({
    accounts: {
      accounts: [account]
    },
    transactions: {
      history: [],
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

  it('renders the signature for offline transactions', async () => {
    const queueTx = makeQueueTx(getTransactionRequest(fAccount.address), true);
    const history = makeHistoryTx(queueTx, TxResult.APPROVED, fSignedTx);

    const store = createMockStore({
      accounts: { accounts: [fAccount] },
      transactions: {
        history: [],
        queue: [],
        currentTransaction: history
      }
    });

    const { findByText } = getComponent(store);
    expect(findByText(fSignedTx)).toBeDefined();
  });

  it('renders EIP1559 gas params', async () => {
    const queueTx = makeQueueTx(
      getEIP1559TransactionRequest(fAccount.address, fTxRequestEIP1559.params[0])
    );
    const store = createMockStore({
      accounts: { accounts: [fAccount] },
      transactions: {
        history: [],
        queue: [queueTx],
        currentTransaction: queueTx
      }
    });
    const { getByText } = getComponent(store);
    expect(getByText(translateRaw('MAX_FEE'), { exact: false }).textContent).toBeDefined();
    expect(getByText(translateRaw('MAX_PRIORITY_FEE'), { exact: false }).textContent).toBeDefined();
  });

  it('allows user to view signed tx', async () => {
    const queueTx = makeQueueTx(
      getEIP1559TransactionRequest(fAccount.address, fTxRequestEIP1559.params[0])
    );
    const history = {
      ...makeHistoryTx(queueTx, TxResult.APPROVED, fSignedTx),
      actionTakenTimestamp: 0
    };
    const store = createMockStore({
      accounts: { accounts: [fAccount] },
      transactions: {
        history: [history],
        queue: [],
        currentTransaction: history
      }
    });
    const { getByText } = getComponent(store);

    const button = getByText(translateRaw('VIEW_SIGNED_TX'));
    expect(button.textContent).toBeDefined();

    fireEvent.click(button);

    expect(store.getActions()).toContainEqual(push(ROUTE_PATHS.VIEW_SIGNED_TRANSACTION));
  });
});

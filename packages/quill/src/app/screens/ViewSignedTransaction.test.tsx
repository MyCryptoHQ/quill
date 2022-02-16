import { makeHistoryTx, makeQueueTx, translateRaw, TxResult } from '@quill/common';
import type { DeepPartial } from '@quill/common';
import type { EnhancedStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { ThemeProvider } from 'styled-components';

import type { ApplicationState } from '@app/store';
import { theme } from '@app/theme';
import { fAccount, fSignedTx, getTransactionRequest } from '@fixtures';

import { ViewSignedTransaction } from './ViewSignedTransaction';

const createMockStore = configureStore<DeepPartial<ApplicationState>>();

function getComponent(store: EnhancedStore<DeepPartial<ApplicationState>>) {
  return render(
    <ThemeProvider theme={theme}>
      <Router>
        <Provider store={store}>
          <ViewSignedTransaction />
        </Provider>
      </Router>
    </ThemeProvider>
  );
}

describe('ViewSignedTransaction', () => {
  it('renders', async () => {
    const queueTx = makeQueueTx(getTransactionRequest(fAccount.address), true);
    const history = makeHistoryTx(queueTx, TxResult.APPROVED, fSignedTx);

    const store = createMockStore({
      accounts: { accounts: [fAccount] },
      transactions: {
        history: [history],
        queue: [],
        currentTransaction: history
      }
    });

    const { findByText } = getComponent(store);
    await expect(findByText(fSignedTx)).resolves.toBeDefined();
    await expect(findByText(translateRaw('VIEW_SIGNED_TX_HEADER'))).resolves.toBeDefined();
  });
});

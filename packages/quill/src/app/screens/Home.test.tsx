import { makeHistoryTx, makeQueueTx, selectTransaction, TxResult } from '@quill/common';
import type { DeepPartial } from '@quill/common';
import type { EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, render } from '@testing-library/react';
import { push } from 'connected-react-router';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { ThemeProvider } from 'styled-components';

import type { ApplicationState } from '@app/store';
import { fAccount, fRequestOrigin, fTxRequest } from '@fixtures';
import { ROUTE_PATHS } from '@routing';
import { theme } from '@theme';

import { Home } from './Home';

jest.mock('@hooks', () => ({
  ...jest.requireActual('@hooks'),
  usePersisted: jest.fn().mockReturnValue(true)
}));

const request = { origin: fRequestOrigin, request: fTxRequest };
const createMockStore = configureStore<DeepPartial<ApplicationState>>();
const queueTx = makeQueueTx(request);
const historyTx = makeHistoryTx(queueTx, TxResult.DENIED);
const mockStore = createMockStore({
  accounts: {
    accounts: [fAccount]
  },
  transactions: {
    queue: [
      queueTx,
      { ...queueTx, id: 2 },
      { ...queueTx, id: 3 },
      { ...queueTx, id: 4 },
      { ...queueTx, id: 5 }
    ],
    history: [historyTx, historyTx, historyTx, historyTx, makeHistoryTx(queueTx, TxResult.APPROVED)]
  },
  persistence: {
    rehydratedKeys: []
  }
});

function getComponent(store: EnhancedStore<DeepPartial<ApplicationState>> = mockStore) {
  return render(
    <Router>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Home />
        </ThemeProvider>
      </Provider>
    </Router>
  );
}

describe('Home', () => {
  it('renders and allows selection of queue and history items', async () => {
    const { getAllByText, getByTestId, getAllByTestId } = getComponent();
    expect(getAllByText('WAITING ON ACTION', { exact: false })).toBeDefined();
    expect(getAllByText('DENIED', { exact: false })).toBeDefined();

    fireEvent.click(getByTestId(`select-tx-${queueTx.id}`));

    fireEvent.click(getByTestId('pagination-next'));
    fireEvent.click(getAllByTestId('select-tx-history')[0]);

    expect(mockStore.getActions()).toContainEqual(selectTransaction(queueTx));
    expect(mockStore.getActions()).toContainEqual(selectTransaction(historyTx));
  });

  it('renders empty state', async () => {
    const { getByText } = getComponent(
      createMockStore({
        accounts: { accounts: [fAccount] },
        transactions: { queue: [], history: [] },
        persistence: { rehydratedKeys: [] }
      })
    );
    expect(
      getByText('There are no transactions in your Quill at this time', { exact: false })
    ).toBeDefined();
  });

  it('navigates to the setup page when there are no accounts', async () => {
    const store = createMockStore({
      accounts: { accounts: [] },
      transactions: { queue: [], history: [] },
      persistence: { rehydratedKeys: [] }
    });

    getComponent(store);

    expect(store.getActions()).toContainEqual(push(ROUTE_PATHS.SETUP_ACCOUNT));
  });

  it('allows user to switch pages', async () => {
    const { getByTestId, queryAllByTestId } = getComponent();

    expect(queryAllByTestId('pending-tx')).toHaveLength(5);
    expect(queryAllByTestId('denied-tx')).toHaveLength(0);
    expect(queryAllByTestId('approved-tx')).toHaveLength(0);

    fireEvent.click(getByTestId('pagination-next'));

    expect(queryAllByTestId('pending-tx')).toHaveLength(0);
    expect(queryAllByTestId('denied-tx')).toHaveLength(4);
    expect(queryAllByTestId('approved-tx')).toHaveLength(1);

    fireEvent.click(getByTestId('pagination-back'));

    expect(queryAllByTestId('pending-tx')).toHaveLength(5);
    expect(queryAllByTestId('denied-tx')).toHaveLength(0);
    expect(queryAllByTestId('approved-tx')).toHaveLength(0);
  });
});

import React from 'react';

import { DeepPartial, EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { ApplicationState, selectTransaction } from '@app/store';
import { fAccount, fTxRequest } from '@fixtures';
import { TxResult } from '@types';
import { makeHistoryTx, makeQueueTx } from '@utils';

import { Home } from '../Home';

const createMockStore = configureStore<DeepPartial<ApplicationState>>();
const queueTx = makeQueueTx(fTxRequest);
const historyTx = makeHistoryTx(queueTx, TxResult.DENIED);
const mockStore = createMockStore({
  accounts: {
    // @ts-expect-error Brand bug with DeepPartial
    accounts: [fAccount]
  },
  transactions: {
    // @ts-expect-error Brand bug with DeepPartial
    queue: [queueTx, { ...queueTx, id: 2 }],
    // @ts-expect-error Brand bug with DeepPartial
    history: [historyTx, historyTx]
  }
});

function getComponent(store: EnhancedStore<DeepPartial<ApplicationState>> = mockStore) {
  return render(
    <Router>
      <Provider store={store}>
        <Home />
      </Provider>
    </Router>
  );
}

describe('Home', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders and allows selection of queue and history items', async () => {
    const { getAllByText, getByTestId, getAllByTestId } = getComponent();
    expect(getAllByText('WAITING ON ACTION', { exact: false })).toBeDefined();
    expect(getAllByText('DENIED', { exact: false })).toBeDefined();

    fireEvent.click(getAllByTestId('select-tx-history')[0]);
    fireEvent.click(getByTestId(`select-tx-${queueTx.id}`));

    expect(mockStore.getActions()).toContainEqual(selectTransaction(queueTx));
    expect(mockStore.getActions()).toContainEqual(selectTransaction(historyTx));
  });

  it('renders empty state', async () => {
    const { getByText } = getComponent(
      // @ts-expect-error Brand bug with DeepPartial
      createMockStore({ accounts: [fAccount], transactions: { queue: [], history: [] } })
    );
    expect(
      getByText('There are no transactions in your Signer at this time', { exact: false })
    ).toBeDefined();
  });
});

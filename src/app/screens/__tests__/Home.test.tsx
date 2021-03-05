import React from 'react';

import { DeepPartial } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { ApplicationState } from '@app/store';
import { fAccount, fTxRequest } from '@fixtures';
import { makeQueueTx } from '@utils';

import { Home } from '../Home';

const createMockStore = configureStore<DeepPartial<ApplicationState>>();
const mockStore = createMockStore({
  accounts: {
    // @ts-expect-error Brand bug with DeepPartial
    accounts: [fAccount]
  },
  transactions: {
    // @ts-expect-error Brand bug with DeepPartial
    queue: [makeQueueTx(fTxRequest)],
    history: []
  }
});

function getComponent() {
  return render(
    <Router>
      <Provider store={mockStore}>
        <Home />
      </Provider>
    </Router>
  );
}

describe('Home', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders', async () => {
    const { getByText } = getComponent();
    expect(getByText('WAITING ON ACTION', { exact: false })).toBeDefined();
  });
});

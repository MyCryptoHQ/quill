import React from 'react';

import { EnhancedStore } from '@reduxjs/toolkit';
import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { ipcBridgeRenderer } from '@bridge';
import { fAccount } from '@fixtures';
import { translateRaw } from '@translations';
import { DBRequestType, DeepPartial } from '@types';

import App from './App';
import { ApplicationState, createStore } from './store';

jest.mock('@bridge', () => ({
  ipcBridgeRenderer: {
    api: {
      subscribeToRequests: jest.fn()
    },
    db: {
      invoke: jest.fn()
    }
  }
}));

const createMockStore = configureStore<DeepPartial<ApplicationState>>();

function getComponent(store: EnhancedStore<DeepPartial<ApplicationState>> = createStore()) {
  return render(
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  );
}

describe('App', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders Home if user has config and is logged in', async () => {
    (ipcBridgeRenderer.db.invoke as jest.Mock).mockImplementation(({ type }) =>
      Promise.resolve(type !== DBRequestType.IS_NEW_USER)
    );
    const { getByText } = getComponent(
      createMockStore({
        auth: { loggedIn: true, newUser: false },
        transactions: { queue: [], history: [] },
        accounts: { accounts: [fAccount] }
      })
    );
    await waitFor(() =>
      expect(
        getByText('There are no transactions in your Signer at this time', { exact: false })
          .textContent
      ).toBeDefined()
    );
  });

  it('renders NewUser if user has no config', async () => {
    (ipcBridgeRenderer.db.invoke as jest.Mock).mockImplementation(({ type }) =>
      Promise.resolve(type === DBRequestType.IS_NEW_USER)
    );
    const { getByText } = getComponent();
    await waitFor(() =>
      expect(getByText(translateRaw('CREATE_PASSWORD')).textContent).toBeDefined()
    );
  });

  it('renders Login if user has config and is not logged in', async () => {
    (ipcBridgeRenderer.db.invoke as jest.Mock).mockImplementation(async () => false);
    const { getByText } = getComponent();
    await waitFor(() => expect(getByText(translateRaw('UNLOCK_NOW')).textContent).toBeDefined());
  });
});

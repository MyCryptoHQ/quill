import React from 'react';

import { DeepPartial, EnhancedStore } from '@reduxjs/toolkit';
import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { ipcBridgeRenderer } from '@bridge';
import { DBRequestType } from '@types';

import App from './App';
import { ApplicationState, createPersistor, createStore } from './store';

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

function getComponent(store: EnhancedStore<ApplicationState> = createStore()) {
  const persistor = createPersistor(store);
  return render(
    <Provider store={store}>
      <Router>
        <App persistor={persistor} />
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
      // @ts-expect-error Brand bug with DeepPartial
      createMockStore({
        auth: { loggedIn: true, newUser: false },
        transactions: { queue: [], history: [] }
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
    await waitFor(() => expect(getByText('Create').textContent).toBeDefined());
  });

  it('renders Login if user has config and is not logged in', async () => {
    (ipcBridgeRenderer.db.invoke as jest.Mock).mockImplementation(({ type }) =>
      Promise.resolve(type === DBRequestType.IS_LOGGED_IN)
    );
    const { getByText } = getComponent();
    await waitFor(() => expect(getByText('Login').textContent).toBeDefined());
  });
});

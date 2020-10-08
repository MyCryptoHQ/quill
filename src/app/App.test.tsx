import React from 'react';

import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';

import App from './App';
import { createPersistor, createStore } from './store';

jest.mock('@bridge', () => ({
  ipcBridgeRenderer: {
    api: {
      subscribeToRequests: () => {
        return () => true;
      }
    }
  }
}));

jest.mock('@app/services/DatabaseService', () => ({
  isNewUser: jest
    .fn()
    .mockImplementationOnce(() => Promise.resolve(true))
    .mockImplementation(() => Promise.resolve(false)),
  isLoggedIn: jest
    .fn()
    .mockImplementationOnce(() => Promise.resolve(false))
    .mockImplementationOnce(() => Promise.resolve(false))
    .mockImplementation(() => Promise.resolve(true)),
  getAccounts: jest.fn().mockImplementation(() => Promise.resolve({})),
  setAccounts: jest.fn().mockImplementation(() => Promise.resolve())
}));

function getComponent() {
  const store = createStore();
  const persistor = createPersistor(store);
  return render(
    <Provider store={store}>
      <App persistor={persistor} />
    </Provider>
  );
}

describe('App', () => {
  it('renders NewUser if user has no config', async () => {
    const { getByText } = getComponent();
    await waitFor(() => expect(getByText('Create').textContent).toBeDefined());
  });

  it('renders Login if user has config and is not logged in', async () => {
    const { getByText } = getComponent();
    await waitFor(() => expect(getByText('Login').textContent).toBeDefined());
  });

  it('renders Home if user has config and is logged in', async () => {
    const { getByText } = getComponent();
    await waitFor(() => expect(getByText('Accept').textContent).toBeDefined());
  });
});

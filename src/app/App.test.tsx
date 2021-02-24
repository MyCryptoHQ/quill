import React from 'react';

import { EnhancedStore } from '@reduxjs/toolkit';
import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';

import App from './App';
import { ApplicationState, createPersistor, createStore } from './store';

jest.mock('@bridge', () => ({
  ipcBridgeRenderer: {
    api: {
      subscribeToRequests: () => {
        return () => true;
      }
    },
    db: {
      invoke: () => {
        return Promise.resolve({});
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
    .mockImplementation(() => Promise.resolve(true))
}));

function getComponent(store: EnhancedStore<ApplicationState> = createStore()) {
  const persistor = createPersistor(store);
  return render(
    <Provider store={store}>
      <App persistor={persistor} />
    </Provider>
  );
}

describe('App', () => {
  it('renders Home if user has config and is logged in', async () => {
    const { getByText } = getComponent(
      createStore({ preloadedState: { auth: { loggedIn: true, newUser: false } } })
    );
    await waitFor(() => expect(getByText('Manage').textContent).toBeDefined());
  });

  it('renders NewUser if user has no config', async () => {
    const { getByText } = getComponent();
    await waitFor(() => expect(getByText('Create').textContent).toBeDefined());
  });

  it('renders Login if user has config and is not logged in', async () => {
    const { getByText } = getComponent();
    await waitFor(() => expect(getByText('Login').textContent).toBeDefined());
  });
});

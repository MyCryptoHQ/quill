import { Process, translateRaw } from '@quill/common';
import type { DeepPartial } from '@quill/common';
import type { EnhancedStore } from '@reduxjs/toolkit';
import { render, waitFor } from '@testing-library/react';
import { connectRouter } from 'connected-react-router';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { fAccount } from '@fixtures';

import App from './App';
import type { ApplicationState } from './store';
import { createStore } from './store';

jest.mock('@bridge', () => ({
  ipcBridgeRenderer: {
    api: {
      subscribeToRequests: jest.fn()
    },
    db: {
      invoke: jest.fn()
    },
    redux: {
      on: jest.fn(),
      emit: jest.fn()
    }
  }
}));

jest.mock('./store', () => ({
  ...jest.requireActual('./store'),
  persistor: {
    persist: jest.fn(),
    subscribe: jest.fn()
  }
}));

const history = createMemoryHistory();
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
    const { getByText } = getComponent(
      createMockStore({
        auth: { initialized: true, loggedIn: true, newUser: false },
        transactions: { queue: [], history: [] },
        accounts: { accounts: [fAccount] },
        synchronization: { isHandshaken: { [Process.Main]: true } },
        persistence: { rehydratedKeys: [] },
        ui: { navigationBack: undefined },
        router: connectRouter(history)(undefined, undefined)
      })
    );
    await waitFor(() =>
      expect(
        getByText('There are no transactions in your Quill at this time', { exact: false })
          .textContent
      ).toBeDefined()
    );
  });

  it('renders NewUser if user has no config', async () => {
    const { getByText } = getComponent(
      createMockStore({
        auth: { initialized: true, loggedIn: false, newUser: true },
        synchronization: { isHandshaken: { [Process.Main]: true } },
        ui: { navigationBack: undefined },
        router: connectRouter(history)(undefined, undefined),
        transactions: { queue: [], history: [] }
      })
    );

    await waitFor(() =>
      expect(getByText(translateRaw('CREATE_PASSWORD')).textContent).toBeDefined()
    );
  });

  it('renders Login if user has config and is not logged in', async () => {
    const { getByText } = getComponent(
      createMockStore({
        auth: { initialized: true, loggedIn: false, newUser: false },
        transactions: { queue: [], history: [] },
        accounts: { accounts: [fAccount] },
        synchronization: { isHandshaken: { [Process.Main]: true } },
        ui: { navigationBack: undefined },
        router: connectRouter(history)(undefined, undefined)
      })
    );

    await waitFor(() => expect(getByText(translateRaw('UNLOCK_NOW')).textContent).toBeDefined());
  });

  it('renders Loading if not persisted', async () => {
    const { getByTestId } = getComponent(
      createMockStore({
        auth: { initialized: true, loggedIn: true, newUser: false },
        transactions: { queue: [], history: [] },
        accounts: { accounts: [], _persistence: {} },
        synchronization: { isHandshaken: { [Process.Main]: true } },
        persistence: { rehydratedKeys: [] },
        ui: { navigationBack: undefined },
        router: connectRouter(history)(undefined, undefined)
      })
    );

    await waitFor(() => expect(getByTestId('spinner')).toBeDefined());
  });

  it('renders Loading if not initialized', async () => {
    const { getByTestId } = getComponent(
      createMockStore({
        auth: { initialized: false, loggedIn: false, newUser: false },
        transactions: { queue: [], history: [] },
        accounts: { accounts: [] },
        synchronization: { isHandshaken: { [Process.Main]: true } },
        persistence: { rehydratedKeys: [] },
        ui: { navigationBack: undefined },
        router: connectRouter(history)(undefined, undefined)
      })
    );

    await waitFor(() => expect(getByTestId('spinner')).toBeDefined());
  });
});

import type { EnhancedStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import type { ApplicationState } from '@app/store';
import { fetchReset } from '@common/store';
import { translateRaw } from '@common/translate';
import { AddAccount } from '@screens';
import type { DeepPartial } from '@types';

jest.mock('electron-store');

const createMockStore = configureStore<DeepPartial<ApplicationState>>();
const mockStore = createMockStore({
  accounts: { accounts: [], addresses: [], isFetching: false, fetchError: undefined }
});

function getComponent(store: EnhancedStore<DeepPartial<ApplicationState>> = mockStore) {
  return render(
    <Router>
      <Provider store={store}>
        <AddAccount />
      </Provider>
    </Router>
  );
}

describe('AddAccount', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders', async () => {
    const { getByText } = getComponent();
    expect(getByText(translateRaw('VERIFY_ACCOUNT')).textContent).toBeDefined();
  });

  it('renders errors from Redux', async () => {
    const error = 'foobar';
    const { getByText } = getComponent(
      createMockStore({
        accounts: { accounts: [], isFetching: false, fetchError: error }
      })
    );
    expect(getByText(error).textContent).toBeDefined();
  });

  it('clears the state on unmount', () => {
    const store = createMockStore({ accounts: {} });
    const { unmount } = getComponent(store);

    unmount();

    expect(store.getActions()).toContainEqual(fetchReset());
    // @todo
    // expect(store.getActions()).toContainEqual(setAccountsToAdd([]));
  });
});

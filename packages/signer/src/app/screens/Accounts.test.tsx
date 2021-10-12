import type { EnhancedStore } from '@reduxjs/toolkit';
import { removeAccount, setNavigationBack, translateRaw } from '@signer/common';
import type { DeepPartial } from '@signer/common';
import { fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import type { ApplicationState } from '@app/store';
import { fAccount } from '@fixtures';
import { ROUTE_PATHS } from '@routing';

import { Accounts } from './Accounts';

const createMockStore = configureStore<DeepPartial<ApplicationState>>();
const mockStore = createMockStore({
  accounts: {
    accounts: [fAccount]
  }
});

function getComponent(store: EnhancedStore<DeepPartial<ApplicationState>> = mockStore) {
  return render(
    <Router>
      <Provider store={store}>
        <Accounts />
      </Provider>
    </Router>
  );
}

describe('Accounts', () => {
  it('renders', async () => {
    const { getByText } = getComponent();
    expect(getByText(fAccount.address).textContent).toBeDefined();
  });

  it('renders empty state', async () => {
    const { getByText } = getComponent(createMockStore({ accounts: { accounts: [] } }));
    expect(getByText(translateRaw('ACCOUNTS_EMPTY_HEADER')).textContent).toBeDefined();
  });

  it('can delete an account', async () => {
    const { getByTestId, getByText } = getComponent();
    const addressText = getByText(fAccount.address);
    expect(addressText).toBeDefined();
    const deleteButton = getByTestId(`delete-${fAccount.address}`);
    expect(deleteButton).toBeDefined();
    fireEvent.click(deleteButton);

    const confirmButton = getByText(translateRaw('DELETE'));
    expect(confirmButton).toBeDefined();
    fireEvent.click(confirmButton);

    expect(mockStore.getActions()).toContainEqual(removeAccount(fAccount));
  });

  it('sets navigationBack', () => {
    const mockStore = createMockStore({
      accounts: {
        accounts: [fAccount]
      }
    });

    const { unmount } = getComponent(mockStore);
    unmount();

    expect(mockStore.getActions()).toStrictEqual([
      setNavigationBack(ROUTE_PATHS.SETTINGS),
      setNavigationBack(undefined)
    ]);
  });
});

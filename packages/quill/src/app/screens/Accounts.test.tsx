import { removeAccount, setNavigationBack, translateRaw } from '@quill/common';
import type { DeepPartial } from '@quill/common';
import type { EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { push } from 'connected-react-router';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { ThemeProvider } from 'styled-components';

import type { ApplicationState } from '@app/store';
import { fAccount } from '@fixtures';
import { ROUTE_PATHS } from '@routing';
import { theme } from '@theme';

import { Accounts } from './Accounts';

const createMockStore = configureStore<DeepPartial<ApplicationState>>();
const mockStore = createMockStore({
  accounts: {
    accounts: [fAccount]
  }
});

function getComponent(store: EnhancedStore<DeepPartial<ApplicationState>> = mockStore) {
  return render(
    <ThemeProvider theme={theme}>
      <Router>
        <Provider store={store}>
          <Accounts />
        </Provider>
      </Router>
    </ThemeProvider>
  );
}

describe('Accounts', () => {
  it('renders', async () => {
    const { getByText } = getComponent();
    expect(getByText(fAccount.address).textContent).toBeDefined();
  });

  it('redirects when no accounts available', async () => {
    const store = createMockStore({ accounts: { accounts: [] } });
    getComponent(store);
    await waitFor(() => expect(store.getActions()).toContainEqual(push(ROUTE_PATHS.SETUP_ACCOUNT)));
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

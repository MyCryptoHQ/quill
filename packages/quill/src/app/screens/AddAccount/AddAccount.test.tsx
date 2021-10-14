import { clearAddAccounts, fetchReset } from '@quill/common';
import type { DeepPartial } from '@quill/common';
import type { EnhancedStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import { push } from 'connected-react-router';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { ThemeProvider } from 'styled-components';

import { ROUTE_PATHS } from '@routing';
import { AddAccount } from '@screens/AddAccount/AddAccount';
import type { ApplicationState } from '@store';
import { theme } from '@theme';

const createMockStore = configureStore<DeepPartial<ApplicationState>>();

const getComponent = (store: EnhancedStore<DeepPartial<ApplicationState>> = createMockStore()) => {
  return render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <AddAccount />
      </ThemeProvider>
    </Provider>
  );
};

describe('AddAccount', () => {
  it('clears the state on unmount', () => {
    const store = createMockStore();
    const { unmount } = getComponent(store);
    unmount();

    expect(store.getActions()).toContainEqual(clearAddAccounts());
    expect(store.getActions()).toContainEqual(fetchReset());
  });

  it('navigates to home when done', () => {
    const store = createMockStore({ flow: 4 });
    getComponent(store);

    expect(store.getActions()).toContainEqual(push(ROUTE_PATHS.HOME));
  });
});

import React from 'react';

import { EnhancedStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { ThemeProvider } from 'styled-components';

import { ApplicationState, setGeneratedAccount } from '@store';
import { theme } from '@theme';
import { DeepPartial } from '@types';

import { GenerateAccount } from './GenerateAccount';

const createMockStore = configureStore<DeepPartial<ApplicationState>>();

const getComponent = (store: EnhancedStore<DeepPartial<ApplicationState>> = createMockStore()) => {
  return render(
    <MemoryRouter>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <GenerateAccount />
        </ThemeProvider>
      </Provider>
    </MemoryRouter>
  );
};

describe('GenerateAccount', () => {
  it('clears the generated account on unmount', () => {
    const store = createMockStore();
    const { unmount } = getComponent(store);
    unmount();

    expect(store.getActions()).toContainEqual(setGeneratedAccount(undefined));
  });
});

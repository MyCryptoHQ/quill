import React from 'react';

import { DeepPartial, EnhancedStore } from '@reduxjs/toolkit';
import { ApplicationState, logout } from '@store';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { Navigation } from './Navigation';

const createMockStore = configureStore<DeepPartial<ApplicationState>>();

const getComponent = (store: EnhancedStore<DeepPartial<ApplicationState>> = createMockStore()) => {
  return render(
    <MemoryRouter>
      <Provider store={store}>
        <Navigation isLoggedIn={true} />
      </Provider>
    </MemoryRouter>
  );
};

describe('Navigation', () => {
  it('dispatches logout when clicking the lock button', () => {
    const mockStore = createMockStore({
      auth: {
        loggedIn: true
      }
    });

    const { getByTestId } = getComponent(mockStore);
    const lockButton = getByTestId('lock-button');

    lockButton.click();

    expect(mockStore.getActions()).toContainEqual(logout());
  });
});
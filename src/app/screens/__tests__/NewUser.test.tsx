import React from 'react';

import { DeepPartial } from '@reduxjs/toolkit';
import { ROUTE_PATHS } from '@routing';
import { fireEvent, render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { ApplicationState } from '@app/store';
import { translateRaw } from '@translations';

import { NewUser } from '../NewUser';

jest.mock('@bridge', () => ({
  ipcBridgeRenderer: {
    db: {
      invoke: jest.fn().mockImplementation(() => Promise.resolve(true))
    }
  }
}));

const createMockStore = configureStore<DeepPartial<ApplicationState>>();

function getComponent(history = createMemoryHistory(), store = createMockStore()) {
  return render(
    <Router history={history}>
      <Provider store={store}>
        <NewUser />
      </Provider>
    </Router>
  );
}

describe('NewUser', () => {
  it('renders', async () => {
    const { getByText } = getComponent();
    expect(getByText(translateRaw('CREATE_PASSWORD')).textContent).toBeDefined();
  });

  it('navigates to create password page', async () => {
    const history = createMemoryHistory();
    const { getByText } = getComponent(history);

    const loginButton = getByText(translateRaw('CREATE_PASSWORD'));
    expect(loginButton).toBeDefined();
    fireEvent.click(loginButton);

    expect(history.location.pathname).toBe(ROUTE_PATHS.CREATE_PASSWORD);
  });
});

import React from 'react';

import { DeepPartial, EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { ApplicationState, login } from '@app/store';

import { Login } from '../Login';

jest.mock('@bridge', () => ({
  ipcBridgeRenderer: {
    db: {
      invoke: jest.fn().mockImplementation((password: string) => password === 'password')
    }
  }
}));

const createMockStore = configureStore<DeepPartial<ApplicationState>>();

const getComponent = (store: EnhancedStore<DeepPartial<ApplicationState>> = createMockStore()) => {
  return render(
    <MemoryRouter>
      <Provider store={store}>
        <Login />
      </Provider>
    </MemoryRouter>
  );
};

describe('Login', () => {
  it('renders', async () => {
    const mockStore = createMockStore({
      auth: {}
    });

    const { getByText } = getComponent(mockStore);
    expect(getByText('Unlock Now').textContent).toBeDefined();
  });

  it('dispatches login when clicking on the button', async () => {
    const mockStore = createMockStore({
      auth: {}
    });

    const { getByLabelText, getByText } = getComponent(mockStore);
    const passwordInput = getByLabelText('MyCrypto Password');
    expect(passwordInput).toBeDefined();
    fireEvent.change(passwordInput, { target: { value: 'password' } });

    const loginButton = getByText('Unlock Now');
    expect(loginButton).toBeDefined();
    fireEvent.click(loginButton);

    expect(mockStore.getActions()).toContainEqual(login('password'));
  });

  it('dispatches login when pressing enter', async () => {
    const mockStore = createMockStore({
      auth: {}
    });

    const { getByLabelText } = getComponent(mockStore);
    const passwordInput = getByLabelText('MyCrypto Password');
    expect(passwordInput).toBeDefined();
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.keyPress(passwordInput, { key: 'Enter', charCode: 13 });

    expect(mockStore.getActions()).toContainEqual(login('password'));
  });
});

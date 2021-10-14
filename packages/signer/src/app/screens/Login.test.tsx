import { login, translateRaw } from '@quill/common';
import type { DeepPartial, EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import type { ApplicationState } from '@app/store';

import { Login } from './Login';

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
    expect(getByText(translateRaw('UNLOCK_NOW')).textContent).toBeDefined();
  });

  it('dispatches login when clicking on the button', async () => {
    const mockStore = createMockStore({
      auth: {}
    });

    const { getByLabelText, getByText } = getComponent(mockStore);
    const passwordInput = getByLabelText('MyCrypto Password');
    expect(passwordInput).toBeDefined();
    fireEvent.change(passwordInput, { target: { value: 'password' } });

    const loginButton = getByText(translateRaw('UNLOCK_NOW'));
    expect(loginButton).toBeDefined();
    fireEvent.click(loginButton);

    await waitFor(() => expect(mockStore.getActions()).toContainEqual(login('password')));
  });

  it('renders form validation error', async () => {
    const mockStore = createMockStore({
      auth: {}
    });

    const { getByText, findByText } = getComponent(mockStore);

    const loginButton = getByText(translateRaw('UNLOCK_NOW'));
    expect(loginButton).toBeDefined();
    await waitFor(() => fireEvent.click(loginButton));

    await expect(findByText(translateRaw('PASSWORD_EMPTY'))).resolves.toBeDefined();
  });
});

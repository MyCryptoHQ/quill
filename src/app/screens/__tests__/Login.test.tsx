import React from 'react';

import { fireEvent, render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';

import { createStore } from '@app/store';
import { ipcBridgeRenderer } from '@bridge';

import { Login } from '../Login';

jest.mock('@bridge', () => ({
  ipcBridgeRenderer: {
    db: {
      invoke: jest.fn().mockImplementation((password: string) => password === 'password')
    }
  }
}));

function getComponent() {
  return render(
    <Router>
      <Provider store={createStore()}>
        <Login />
      </Provider>
    </Router>
  );
}

describe('Login', () => {
  it('renders', async () => {
    const { getByText } = getComponent();
    expect(getByText('Unlock Now').textContent).toBeDefined();
  });

  it('can login', async () => {
    const { getByLabelText, getByText } = getComponent();
    const passwordInput = getByLabelText('MyCrypto Password');
    expect(passwordInput).toBeDefined();
    fireEvent.change(passwordInput, { target: { value: 'password' } });

    const loginButton = getByText('Unlock Now');
    expect(loginButton).toBeDefined();
    fireEvent.click(loginButton);
    expect(ipcBridgeRenderer.db.invoke).toHaveBeenCalledWith(
      expect.objectContaining({ password: 'password' })
    );
  });

  it('can fail login with wrong password', async () => {
    const { getByLabelText, getByText } = getComponent();
    const passwordInput = getByLabelText('MyCrypto Password');
    expect(passwordInput).toBeDefined();
    fireEvent.change(passwordInput, { target: { value: 'password1' } });

    const loginButton = getByText('Unlock Now');
    expect(loginButton).toBeDefined();
    fireEvent.click(loginButton);
    expect(ipcBridgeRenderer.db.invoke).toHaveBeenCalledWith(
      expect.objectContaining({ password: 'password1' })
    );

    waitFor(() => expect(getByText('An error occurred')).toBeDefined());
  });
});

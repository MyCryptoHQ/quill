import React from 'react';

import { fireEvent, render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';

import { login as loginFunc } from '@app/services/DatabaseService';
import { createStore } from '@app/store';

import { Login } from '.';

jest.mock('@app/services/DatabaseService', () => ({
  login: jest.fn().mockImplementation((password: string) => password === 'password')
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
    expect(getByText('Login').textContent).toBeDefined();
  });

  it('can login', async () => {
    const { getByLabelText, getByText } = getComponent();
    const passwordInput = getByLabelText('Master Password');
    expect(passwordInput).toBeDefined();
    fireEvent.change(passwordInput, { target: { value: 'password' } });

    const loginButton = getByText('Login');
    expect(loginButton).toBeDefined();
    fireEvent.click(loginButton);
    expect(loginFunc).toHaveBeenCalledWith('password');
  });

  it('can fail login with wrong password', async () => {
    const { getByLabelText, getByText } = getComponent();
    const passwordInput = getByLabelText('Master Password');
    expect(passwordInput).toBeDefined();
    fireEvent.change(passwordInput, { target: { value: 'password1' } });

    const loginButton = getByText('Login');
    expect(loginButton).toBeDefined();
    fireEvent.click(loginButton);
    expect(loginFunc).toHaveBeenCalledWith('password');

    waitFor(() => expect(getByText('An error occurred')).toBeDefined());
  });
});

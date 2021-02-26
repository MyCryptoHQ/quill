import React from 'react';

import { fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';

import { createStore } from '@app/store';
import { ipcBridgeRenderer } from '@bridge';

import { NewUser } from '../NewUser';

jest.mock('@bridge', () => ({
  ipcBridgeRenderer: {
    db: {
      invoke: jest.fn().mockImplementation(() => Promise.resolve(true))
    }
  }
}));

function getComponent() {
  return render(
    <Provider store={createStore()}>
      <NewUser />
    </Provider>
  );
}

describe('NewUser', () => {
  it('renders', async () => {
    const { getByText } = getComponent();
    expect(getByText('Create').textContent).toBeDefined();
  });

  it('can login', async () => {
    // Use randomly generated secure pw to meet pw requirements
    const password = 'm8A5fc26bH8Z';
    const { getByLabelText, getByText } = getComponent();
    const passwordInput = getByLabelText('Enter a new master password');
    expect(passwordInput).toBeDefined();
    fireEvent.change(passwordInput, { target: { value: password } });

    const loginButton = getByText('Create');
    expect(loginButton).toBeDefined();
    fireEvent.click(loginButton);
    expect(ipcBridgeRenderer.db.invoke).toHaveBeenCalledWith(expect.objectContaining({ password }));
  });
});

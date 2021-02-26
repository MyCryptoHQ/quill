import React from 'react';

import { fireEvent, render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';

import { createStore } from '@app/store';
import { ipcBridgeRenderer } from '@bridge';

import { CreateWallet } from '../CreateWallet';

jest.mock('@bridge', () => ({
  ipcBridgeRenderer: {
    crypto: {
      invoke: jest.fn().mockReturnValue('mnemonic phrase')
    }
  }
}));

const mockReplace = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    replace: mockReplace
  })
}));

function getComponent() {
  return render(
    <Router>
      <Provider store={createStore()}>
        <CreateWallet />
      </Provider>
    </Router>
  );
}

describe('CreateWallet', () => {
  it('renders', async () => {
    const { getByText } = getComponent();
    expect(getByText('Create Mnemonic Phrase').textContent).toBeDefined();
  });

  it('can generate mnemonic phrase and redirect to Add Account', async () => {
    const { getByText } = getComponent();

    const createButton = getByText('Create Mnemonic Phrase');
    expect(createButton).toBeDefined();
    fireEvent.click(createButton);
    expect(ipcBridgeRenderer.crypto.invoke).toHaveBeenCalled();

    await waitFor(() => expect(getByText('OK')).toBeDefined());
    const okButton = getByText('OK');
    fireEvent.click(okButton);
    expect(mockReplace).toHaveBeenCalled();
  });
});

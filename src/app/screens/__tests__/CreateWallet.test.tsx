import React from 'react';

import { fireEvent, render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';

import { createMnemonic } from '@app/services/WalletService';
import { createStore } from '@app/store';

import { CreateWallet } from '../CreateWallet';

jest.mock('@app/services/WalletService', () => ({
  createMnemonic: jest.fn().mockReturnValue('mnemonic phrase')
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
    expect(createMnemonic).toHaveBeenCalled();

    await waitFor(() => expect(getByText('OK')).toBeDefined());
    const okButton = getByText('OK');
    fireEvent.click(okButton);
    expect(mockReplace).toHaveBeenCalled();
  });
});

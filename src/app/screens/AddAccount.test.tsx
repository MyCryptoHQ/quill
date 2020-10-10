import React from 'react';

import { EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';

import { getAddressFromPrivateKey } from '@app/services/WalletService';
import { ApplicationState, createStore } from '@app/store';

import { AddAccount } from '.';

jest.mock('@app/services/WalletService', () => ({
  getAddressFromPrivateKey: jest
    .fn()
    .mockImplementation(() =>
      Promise.resolve({
        uuid: '4be38596-5d9c-5c01-8e04-19d1c726fe24',
        address: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520'
      })
    )
}));

function getComponent(store: EnhancedStore<ApplicationState> = createStore()) {
  return render(
    <Router>
      <Provider store={store}>
        <AddAccount />
      </Provider>
    </Router>
  );
}

describe('AddAccount', () => {
  it('renders', async () => {
    const { getByText } = getComponent();
    expect(getByText('Submit').textContent).toBeDefined();
  });

  it('can submit private key', async () => {
    const store = createStore();
    const { getByLabelText, getByText } = getComponent(store);
    const privKeyInput = getByLabelText('Private Key');
    expect(privKeyInput).toBeDefined();
    fireEvent.change(privKeyInput, { target: { value: 'privkey' } });

    const submitButton = getByText('Submit');
    expect(submitButton).toBeDefined();
    fireEvent.click(submitButton);
    expect(getAddressFromPrivateKey).toHaveBeenCalledWith('privkey');
    await waitFor(() => expect(Object.keys(store.getState().accounts)).toHaveLength(1));
  });
});

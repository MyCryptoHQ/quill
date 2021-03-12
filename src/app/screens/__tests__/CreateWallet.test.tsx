import React from 'react';

import { DeepPartial } from '@reduxjs/toolkit';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { replace } from 'connected-react-router';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { ROUTE_PATHS } from '@app/routing';
import { ApplicationState } from '@app/store';
import { ipcBridgeRenderer } from '@bridge';

import { CreateWallet } from '../CreateWallet';

jest.mock('@bridge', () => ({
  ipcBridgeRenderer: {
    crypto: {
      invoke: jest.fn().mockReturnValue('mnemonic phrase')
    }
  }
}));

const createMockStore = configureStore<DeepPartial<ApplicationState>>();
const mockStore = createMockStore();

function getComponent() {
  return render(
    <Router>
      <Provider store={mockStore}>
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
    expect(mockStore.getActions()).toContainEqual(replace(ROUTE_PATHS.ADD_ACCOUNT));
  });
});

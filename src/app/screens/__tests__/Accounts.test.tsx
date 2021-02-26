import React from 'react';

import { EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';

import { ApplicationState, createStore } from '@app/store';
import { ipcBridgeRenderer } from '@bridge';
import { fAccount } from '@fixtures';
import { DBRequestType } from '@types';

import { Accounts } from '../Accounts';

jest.mock('@bridge', () => ({
  ipcBridgeRenderer: {
    db: { invoke: jest.fn() }
  }
}));

function getComponent(store: EnhancedStore<ApplicationState> = createStore()) {
  return render(
    <Router>
      <Provider store={store}>
        <Accounts />
      </Provider>
    </Router>
  );
}

describe('Accounts', () => {
  it('renders', async () => {
    const { getByText } = getComponent();
    expect(getByText('Back').textContent).toBeDefined();
  });

  it('can delete account', async () => {
    const store = createStore({
      preloadedState: {
        // @ts-expect-error Brand bug with DeepPartial
        accounts: { accounts: [{ ...fAccount, persistent: true }] }
      }
    });
    const { getByTestId, getByText } = getComponent(store);
    const addressText = getByText(fAccount.address);
    expect(addressText).toBeDefined();
    const deleteButton = getByTestId(`delete-${fAccount.address}`);
    expect(deleteButton).toBeDefined();
    fireEvent.click(deleteButton);

    await waitFor(() =>
      expect(ipcBridgeRenderer.db.invoke).toHaveBeenCalledWith({
        type: DBRequestType.DELETE_PRIVATE_KEY,
        uuid: fAccount.uuid
      })
    );
    await waitFor(() => expect(Object.keys(store.getState().accounts.accounts)).toHaveLength(0));
  });
});

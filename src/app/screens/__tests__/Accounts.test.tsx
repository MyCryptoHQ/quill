import { EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { ApplicationState, removeAccount } from '@app/store';
import { translateRaw } from '@common/translate';
import { fAccount } from '@fixtures';
import { DeepPartial } from '@types';

import { Accounts } from '../Accounts';

const createMockStore = configureStore<DeepPartial<ApplicationState>>();
const mockStore = createMockStore({
  accounts: {
    accounts: [fAccount]
  }
});

function getComponent(store: EnhancedStore<DeepPartial<ApplicationState>> = mockStore) {
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
    expect(getByText(fAccount.address).textContent).toBeDefined();
  });

  it('can delete account', async () => {
    const { getByTestId, getByText } = getComponent();
    const addressText = getByText(fAccount.address);
    expect(addressText).toBeDefined();
    const deleteButton = getByTestId(`delete-${fAccount.address}`);
    expect(deleteButton).toBeDefined();
    fireEvent.click(deleteButton);

    const confirmButton = getByText(translateRaw('DELETE'));
    expect(confirmButton).toBeDefined();
    fireEvent.click(confirmButton);

    expect(mockStore.getActions()).toContainEqual(removeAccount(fAccount));
  });
});

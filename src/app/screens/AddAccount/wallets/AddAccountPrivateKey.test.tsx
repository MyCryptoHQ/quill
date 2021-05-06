import type { EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router';
import configureStore from 'redux-mock-store';

import { fetchAccounts } from '@common/store';
import { translateRaw } from '@common/translate';
import { fPrivateKey } from '@fixtures';
import { AddAccountStart } from '@screens';
import type { ApplicationState } from '@store';
import type { DeepPartial } from '@types';
import { WalletType } from '@types';

const createMockStore = configureStore<DeepPartial<ApplicationState>>();
const mockStore = createMockStore({
  accounts: { accounts: [], addresses: [], isFetching: false, fetchError: undefined }
});

const getComponent = (store: EnhancedStore<DeepPartial<ApplicationState>> = mockStore) => {
  return render(
    <Router>
      <Provider store={store}>
        <AddAccountStart
          walletType={WalletType.PRIVATE_KEY}
          onNext={jest.fn()}
          onPrevious={jest.fn()}
          onReset={jest.fn()}
          flowHeader={<></>}
        />
      </Provider>
    </Router>
  );
};

describe('AddAccountPrivateKey', () => {
  it('can submit private key', async () => {
    const { getByText, container } = getComponent();

    const privKeyInput = container.querySelector('input[name="privateKey"]');
    expect(privKeyInput).toBeDefined();
    fireEvent.change(privKeyInput, { target: { value: fPrivateKey } });

    const submitButton = getByText(translateRaw('VERIFY_ACCOUNT'));
    expect(submitButton).toBeDefined();
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(mockStore.getActions()).toContainEqual(
        fetchAccounts([
          {
            walletType: WalletType.PRIVATE_KEY,
            privateKey: fPrivateKey
          }
        ])
      )
    );
  });

  it('shows private key form validation', async () => {
    const { getByText } = getComponent();

    const submitButton = getByText(translateRaw('VERIFY_ACCOUNT'));
    expect(submitButton).toBeDefined();
    fireEvent.click(submitButton);

    await waitFor(() => expect(getByText(translateRaw('PRIVATE_KEY_EMPTY'))).toBeDefined());
  });
});

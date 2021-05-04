import type { EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, render } from '@testing-library/react';
import { goBack } from 'connected-react-router';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router';
import configureStore from 'redux-mock-store';

import { WalletTypeSelector } from '@components/WalletTypeSelector';
import type { ApplicationState } from '@store';
import type { DeepPartial } from '@types';
import { WalletType } from '@types';

const createMockStore = configureStore<DeepPartial<ApplicationState>>();
const getComponent = (store: EnhancedStore<DeepPartial<ApplicationState>> = createMockStore()) => {
  return render(
    <Router>
      <Provider store={store}>
        <WalletTypeSelector walletType={WalletType.PRIVATE_KEY} setWalletType={jest.fn()} />
      </Provider>
    </Router>
  );
};

describe('WalletTypeSelector', () => {
  it('navigates back when clicking the button', () => {
    const store = createMockStore();
    const { getByTestId } = getComponent(store);

    const button = getByTestId('back-button');
    fireEvent.click(button);

    expect(store.getActions()).toContainEqual(goBack());
  });
});

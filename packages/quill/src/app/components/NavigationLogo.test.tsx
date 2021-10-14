import type { DeepPartial } from '@quill/common';
import { makeQueueTx } from '@quill/common';
import type { EnhancedStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import { fAccount, getTransactionRequest } from '@fixtures';
import type { ApplicationState } from '@store';

import { NavigationLogo } from './NavigationLogo';

const createMockStore = configureStore<DeepPartial<ApplicationState>>();

const getComponent = (store: EnhancedStore<DeepPartial<ApplicationState>> = createMockStore()) => {
  return render(
    <Provider store={store}>
      <NavigationLogo />
    </Provider>
  );
};

describe('NavigationLogo', () => {
  it('shows number of pending transactions', () => {
    const queueTx = makeQueueTx(getTransactionRequest(fAccount.address));
    const mockStore = createMockStore({
      transactions: {
        queue: [queueTx]
      }
    });

    const { getByText } = getComponent(mockStore);
    expect(getByText('1')).toBeDefined();
  });
});

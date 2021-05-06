import type { EnhancedStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import type { ApplicationState } from '@app/store';
import { translateRaw } from '@common/translate';
import { AddAccountStart } from '@screens';
import type { DeepPartial } from '@types';

jest.mock('electron-store');

const createMockStore = configureStore<DeepPartial<ApplicationState>>();
const mockStore = createMockStore({
  accounts: { accounts: [], addresses: [], isFetching: false, fetchError: undefined }
});

function getComponent(store: EnhancedStore<DeepPartial<ApplicationState>> = mockStore) {
  return render(
    <Router>
      <Provider store={store}>
        <AddAccountStart
          onNext={jest.fn()}
          onPrevious={jest.fn()}
          onReset={jest.fn()}
          flowHeader={<></>}
        />
      </Provider>
    </Router>
  );
}

describe('AddAccountStart', () => {
  it('renders', async () => {
    const { getByText } = getComponent();
    expect(getByText(translateRaw('REVIEW_SECURITY_DETAILS')).textContent).toBeDefined();
  });

  it('renders errors from Redux', async () => {
    const error = 'foobar';
    const { getByText } = getComponent(
      createMockStore({
        accounts: { accounts: [], isFetching: false, fetchError: error }
      })
    );
    expect(getByText(error).textContent).toBeDefined();
  });
});

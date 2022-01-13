import { translateRaw } from '@quill/common';
import type { DeepPartial } from '@quill/common';
import type { EnhancedStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { ThemeProvider } from 'styled-components';

import type { ApplicationState } from '@app/store';
import { theme } from '@theme';

import { AddAccountStart } from './AddAccountStart';

jest.mock('electron-store');

const createMockStore = configureStore<DeepPartial<ApplicationState>>();
const mockStore = createMockStore({
  accounts: { accounts: [], addresses: [], isFetching: false, fetchError: undefined }
});

function getComponent(store: EnhancedStore<DeepPartial<ApplicationState>> = mockStore) {
  return render(
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
  );
}

describe('AddAccountStart', () => {
  it('renders', async () => {
    const { getByText } = getComponent();
    expect(getByText(translateRaw('NEXT')).textContent).toBeDefined();
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

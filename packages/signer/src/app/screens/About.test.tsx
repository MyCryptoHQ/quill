import type { EnhancedStore } from '@reduxjs/toolkit';
import type { DeepPartial } from '@signer/common';
import { setNavigationBack, translateRaw } from '@signer/common';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router';
import configureStore from 'redux-mock-store';

import { ROUTE_PATHS } from '@routing';
import type { ApplicationState } from '@store';

import { About } from './About';

const createMockStore = configureStore<DeepPartial<ApplicationState>>();

const getComponent = (store: EnhancedStore<DeepPartial<ApplicationState>> = createMockStore()) => {
  return render(
    <Router>
      <Provider store={store}>
        <About />
      </Provider>
    </Router>
  );
};

describe('About', () => {
  it('renders', async () => {
    const { findByText } = getComponent();
    await expect(findByText(translateRaw('ABOUT_QUILL'))).resolves.toBeDefined();
  });

  it('sets navigationBack', () => {
    const mockStore = createMockStore();
    const { unmount } = getComponent(mockStore);
    unmount();

    expect(mockStore.getActions()).toStrictEqual([
      setNavigationBack(ROUTE_PATHS.SETTINGS),
      setNavigationBack(undefined)
    ]);
  });
});

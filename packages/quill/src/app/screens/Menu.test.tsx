import { setNavigationBack, translateRaw } from '@quill/common';
import type { DeepPartial } from '@quill/common';
import type { EnhancedStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { ROUTE_PATHS } from '@routing';
import type { ApplicationState } from '@store';

import { Menu } from './Menu';

const createMockStore = configureStore<DeepPartial<ApplicationState>>();

const getComponent = (store: EnhancedStore<DeepPartial<ApplicationState>> = createMockStore()) => {
  return render(
    <MemoryRouter>
      <Provider store={store}>
        <Menu />
      </Provider>
    </MemoryRouter>
  );
};

describe('Menu', () => {
  it('renders', async () => {
    const { getByText } = getComponent();
    expect(getByText(translateRaw('MENU_HEADER')).textContent).toBeDefined();
  });

  it('sets navigationBack', () => {
    const mockStore = createMockStore();

    const { unmount } = getComponent(mockStore);
    unmount();

    expect(mockStore.getActions()).toStrictEqual([
      setNavigationBack(ROUTE_PATHS.HOME),
      setNavigationBack(undefined)
    ]);
  });
});

import type { EnhancedStore } from '@reduxjs/toolkit';
import {
  AUTO_LOCK_TIMEOUT,
  quitApp,
  setAutoLockTimeout,
  setNavigationBack,
  translateRaw
} from '@signer/common';
import type { DeepPartial } from '@signer/common';
import { fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import selectEvent from 'react-select-event';
import configureStore from 'redux-mock-store';

import type { ApplicationState } from '@app/store';
import { fAccount } from '@fixtures';
import { ROUTE_PATHS } from '@routing';

import { Settings } from './Settings';

const createMockStore = configureStore<DeepPartial<ApplicationState>>();
const mockStore = createMockStore({
  accounts: {
    accounts: [fAccount]
  },
  appSettings: {
    autoLockTimeout: AUTO_LOCK_TIMEOUT
  }
});

function getComponent(store: EnhancedStore<DeepPartial<ApplicationState>> = mockStore) {
  return render(
    <Router>
      <Provider store={store}>
        <Settings />
      </Provider>
    </Router>
  );
}

describe('Settings', () => {
  it('renders', async () => {
    const { getByText } = getComponent();
    expect(getByText(translateRaw('SETTINGS')).textContent).toBeDefined();
  });

  it('can change auto lock timeout', async () => {
    const mockStore = createMockStore({
      appSettings: {
        autoLockTimeout: AUTO_LOCK_TIMEOUT
      }
    });
    const { getByText } = getComponent(mockStore);
    const lockSection = getByText(translateRaw('AUTO_LOCK_TIMER'));
    fireEvent.click(lockSection);
    const currentOption = getByText(translateRaw('TIME_MINUTES', { $value: '5' }));
    selectEvent.openMenu(currentOption);
    const newOption = getByText(translateRaw('TIME_MINUTES', { $value: '10' }));
    fireEvent.click(newOption);

    expect(mockStore.getActions()).toStrictEqual([
      setNavigationBack(ROUTE_PATHS.HOME),
      setAutoLockTimeout(600000)
    ]);
  });

  it('can quit app', async () => {
    const mockStore = createMockStore({
      appSettings: {
        autoLockTimeout: AUTO_LOCK_TIMEOUT
      }
    });
    const { getByText } = getComponent(mockStore);
    const quitSection = getByText(translateRaw('QUIT_APP'));
    fireEvent.click(quitSection);
    const quitButton = getByText(translateRaw('QUIT_NOW'));
    fireEvent.click(quitButton);

    expect(mockStore.getActions()).toStrictEqual([setNavigationBack(ROUTE_PATHS.HOME), quitApp()]);
  });

  it('sets navigationBack', () => {
    const mockStore = createMockStore({
      appSettings: {
        autoLockTimeout: AUTO_LOCK_TIMEOUT
      }
    });

    const { unmount } = getComponent(mockStore);
    unmount();

    expect(mockStore.getActions()).toStrictEqual([
      setNavigationBack(ROUTE_PATHS.HOME),
      setNavigationBack(undefined)
    ]);
  });
});

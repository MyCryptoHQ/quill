import type { DeepPartial, EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import type { ApplicationState } from '@app/store';
import { denyPermission, grantPermission, updatePermission } from '@common/store';
import { translateRaw } from '@common/translate';
import { fPermission } from '@fixtures';

import { RequestPermission } from '../RequestPermission';

const createMockStore = configureStore<DeepPartial<ApplicationState>>();

const getComponent = (store: EnhancedStore<DeepPartial<ApplicationState>> = createMockStore()) => {
  return render(
    <MemoryRouter>
      <Provider store={store}>
        <RequestPermission />
      </Provider>
    </MemoryRouter>
  );
};

describe('RequestPermission', () => {
  it('renders', async () => {
    const mockStore = createMockStore({
      permissions: { permissions: [], permissionRequest: fPermission }
    });

    const { getByText } = getComponent(mockStore);
    expect(getByText(translateRaw('ALLOW_PERMISSIONS')).textContent).toBeDefined();
    expect(getByText(fPermission.origin).textContent).toBeDefined();
  });

  it('dispatches grantPermission on allow', async () => {
    const mockStore = createMockStore({
      permissions: { permissions: [], permissionRequest: fPermission }
    });

    const { getByText } = getComponent(mockStore);

    const allowButton = getByText(translateRaw('ALLOW_PERMISSIONS'));
    expect(allowButton).toBeDefined();
    fireEvent.click(allowButton);

    await waitFor(() =>
      expect(mockStore.getActions()).toContainEqual(grantPermission(fPermission))
    );
  });

  it('dispatches grantPermission on allow with existing perms', async () => {
    const newPerm = { ...fPermission, publicKey: 'foo' };
    const mockStore = createMockStore({
      permissions: { permissions: [fPermission], permissionRequest: newPerm }
    });

    const { getByText } = getComponent(mockStore);

    const allowButton = getByText(translateRaw('ALLOW_PERMISSIONS'));
    expect(allowButton).toBeDefined();
    fireEvent.click(allowButton);

    await waitFor(() => expect(mockStore.getActions()).toContainEqual(updatePermission(newPerm)));
  });

  it('dispatches denyPermission on deny', async () => {
    const mockStore = createMockStore({
      permissions: { permissions: [], permissionRequest: fPermission }
    });

    const { getByText } = getComponent(mockStore);

    const denyButton = getByText(translateRaw('DENY_PERMISSIONS'));
    expect(denyButton).toBeDefined();
    fireEvent.click(denyButton);

    await waitFor(() => expect(mockStore.getActions()).toContainEqual(denyPermission(fPermission)));
  });
});

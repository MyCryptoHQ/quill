import React from 'react';

import { fireEvent, render } from '@testing-library/react';
import { replace } from 'connected-react-router';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { ROUTE_PATHS } from '@app/routing';
import { ApplicationState } from '@app/store';
import { ipcBridgeRenderer } from '@bridge';
import { DBRequestType, DeepPartial } from '@types';

import { ForgotPassword } from '../ForgotPassword';

jest.mock('@bridge', () => ({
  ipcBridgeRenderer: {
    db: { invoke: jest.fn() }
  }
}));

const createMockStore = configureStore<DeepPartial<ApplicationState>>();
const mockStore = createMockStore();

function getComponent() {
  return render(
    <Router>
      <Provider store={mockStore}>
        <ForgotPassword />
      </Provider>
    </Router>
  );
}

describe('ForgotPassword', () => {
  it('renders', async () => {
    const { getByText } = getComponent();
    expect(getByText('Yes').textContent).toBeDefined();
  });

  it('can reset', async () => {
    const { getByText } = getComponent();
    const yesButton = getByText('Yes');
    expect(yesButton).toBeDefined();
    fireEvent.click(yesButton);

    expect(ipcBridgeRenderer.db.invoke).toHaveBeenCalledWith({ type: DBRequestType.RESET });
    expect(mockStore.getActions()).toContainEqual(replace(ROUTE_PATHS.LOCKED));
  });

  it('can cancel', async () => {
    const { getByText } = getComponent();
    const cancelButton = getByText('No');
    expect(cancelButton).toBeDefined();
    fireEvent.click(cancelButton);

    expect(mockStore.getActions()).toContainEqual(replace(ROUTE_PATHS.LOCKED));
  });
});

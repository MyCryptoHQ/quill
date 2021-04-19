import { fireEvent, render } from '@testing-library/react';
import { push } from 'connected-react-router';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { ROUTE_PATHS } from '@app/routing';
import type { ApplicationState } from '@app/store';
import { reset, setNewUser } from '@common/store';
import { translateRaw } from '@common/translate';
import type { DeepPartial } from '@types';

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
    expect(getByText(translateRaw('RESET_HEADING')).textContent).toBeDefined();
  });

  it('can reset', async () => {
    const { getByText } = getComponent();
    const confirmButton = getByText(translateRaw('RESET_CONFIRM'));
    expect(confirmButton).toBeDefined();
    fireEvent.click(confirmButton);

    expect(mockStore.getActions()).toContainEqual(reset());
    expect(mockStore.getActions()).toContainEqual(setNewUser(true));
    expect(mockStore.getActions()).toContainEqual(push(ROUTE_PATHS.LOCKED));
  });

  it('can cancel', async () => {
    const { getByText } = getComponent();
    const cancelButton = getByText(translateRaw('RESET_CANCEL'));
    expect(cancelButton).toBeDefined();
    fireEvent.click(cancelButton);

    expect(mockStore.getActions()).toContainEqual(push(ROUTE_PATHS.LOCKED));
  });
});

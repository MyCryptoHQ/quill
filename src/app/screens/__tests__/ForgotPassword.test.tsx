import { fireEvent, render } from '@testing-library/react';
import { push } from 'connected-react-router';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { ROUTE_PATHS } from '@app/routing';
import { ApplicationState } from '@app/store';
import { ipcBridgeRenderer } from '@bridge';
import { translateRaw } from '@common/translate';
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
    expect(getByText(translateRaw('RESET_HEADING')).textContent).toBeDefined();
  });

  it('can reset', async () => {
    const { getByText } = getComponent();
    const confirmButton = getByText(translateRaw('RESET_CONFIRM'));
    expect(confirmButton).toBeDefined();
    fireEvent.click(confirmButton);

    expect(ipcBridgeRenderer.db.invoke).toHaveBeenCalledWith({ type: DBRequestType.RESET });
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

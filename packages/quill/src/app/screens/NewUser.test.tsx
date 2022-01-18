import { translateRaw } from '@quill/common';
import type { DeepPartial } from '@quill/common';
import { fireEvent, render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { ThemeProvider } from 'styled-components';

import type { ApplicationState } from '@app/store';
import { ROUTE_PATHS } from '@routing';
import { theme } from '@theme';

import { NewUser } from './NewUser';

jest.mock('@bridge', () => ({
  ipcBridgeRenderer: {
    db: {
      invoke: jest.fn().mockImplementation(() => Promise.resolve(true))
    }
  }
}));

const createMockStore = configureStore<DeepPartial<ApplicationState>>();

function getComponent(history = createMemoryHistory(), store = createMockStore()) {
  return render(
    <ThemeProvider theme={theme}>
      <Router history={history}>
        <Provider store={store}>
          <NewUser />
        </Provider>
      </Router>
    </ThemeProvider>
  );
}

describe('NewUser', () => {
  it('renders', async () => {
    const { getByText } = getComponent();
    expect(getByText(translateRaw('CREATE_PASSWORD')).textContent).toBeDefined();
  });

  it('navigates to create password page', async () => {
    const history = createMemoryHistory();
    const { getByText } = getComponent(history);

    const loginButton = getByText(translateRaw('CREATE_PASSWORD'));
    expect(loginButton).toBeDefined();
    fireEvent.click(loginButton);

    expect(history.location.pathname).toBe(ROUTE_PATHS.CREATE_PASSWORD);
  });
});

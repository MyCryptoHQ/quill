import type { EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, render } from '@testing-library/react';
import { push } from 'connected-react-router';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router';
import configureStore from 'redux-mock-store';

import { translateRaw } from '@common/translate';
import { ROUTE_PATHS } from '@routing';
import type { ApplicationState } from '@store';
import type { DeepPartial } from '@types';

import { AddAccountSecurity } from './AddAccountSecurity';

const createMockStore = configureStore<DeepPartial<ApplicationState>>();

const getComponent = (store: EnhancedStore<DeepPartial<ApplicationState>> = createMockStore()) => {
  return render(
    <Router>
      <Provider store={store}>
        <AddAccountSecurity />
      </Provider>
    </Router>
  );
};

describe('AddAccountSecurity', () => {
  it('enables the button when scrolled to bottom', async () => {
    const store = createMockStore();
    const { getByText, getByTestId } = getComponent(store);

    const button = getByText(translateRaw('ACKNOWLEDGE_AND_CONTINUE'));
    fireEvent.click(button);
    expect(store.getActions()).not.toContainEqual(push(ROUTE_PATHS.ADD_ACCOUNT_BACKUP));

    const wrapper = getByTestId('scroll-wrapper');
    fireEvent.scroll(wrapper);

    fireEvent.click(button);
    expect(store.getActions()).toContainEqual(push(ROUTE_PATHS.ADD_ACCOUNT_BACKUP));
  });

  it.todo('clears the state on unmount');
  // it('clears the state on unmount', async () => {
  //   const store = createMockStore();
  //   const { unmount } = getComponent(store);
  //
  //   unmount();
  //
  //   expect(store.getActions()).toContainEqual(setAccountsToAdd([]));
  // });
});

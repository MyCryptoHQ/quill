import { nextFlow, translateRaw } from '@quill/common';
import type { DeepPartial } from '@quill/common';
import type { EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router';
import configureStore from 'redux-mock-store';

import type { ApplicationState } from '@store';

import { AddAccountSecurity } from './AddAccountSecurity';

const createMockStore = configureStore<DeepPartial<ApplicationState>>();

const getComponent = (store: EnhancedStore<DeepPartial<ApplicationState>> = createMockStore()) => {
  return render(
    <Router>
      <Provider store={store}>
        <AddAccountSecurity
          onNext={jest.fn()}
          onPrevious={jest.fn()}
          onReset={jest.fn()}
          flowHeader={<></>}
        />
      </Provider>
    </Router>
  );
};

describe('AddAccountSecurity', () => {
  it('goes to the next step', () => {
    const store = createMockStore();
    const { getByText } = getComponent(store);

    const button = getByText(translateRaw('ACKNOWLEDGE_AND_CONTINUE'));

    fireEvent.click(button);
    expect(store.getActions()).toContainEqual(nextFlow());
  });
});

import React from 'react';

import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import { createStore } from '@app/store';

import { Home } from '.';

jest.mock('@bridge', () => ({
  ipcBridgeRenderer: {
    api: {
      subscribeToRequests: () => {
        return () => true;
      }
    }
  }
}));

function getComponent() {
  return render(
    <Provider store={createStore()}>
      <Home />
    </Provider>
  );
}

describe('Home', () => {
  test('it renders', async () => {
    const { getByText } = getComponent();
    expect(getByText('Accept').textContent).toBeDefined();
  });
});

import React from 'react';

import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';

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
    <Router>
      <Provider store={createStore()}>
        <Home />
      </Provider>
    </Router>
  );
}

describe('Home', () => {
  it('renders', async () => {
    const { getByText } = getComponent();
    expect(getByText('Accept').textContent).toBeDefined();
  });
});

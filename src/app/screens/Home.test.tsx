import React from 'react';

import { render } from '@testing-library/react';

import { Home } from '.';

jest.mock('@bridge', () => ({
  ipcBridge: {
    subscribeToRequests: () => {
      return () => true;
    }
  }
}));

function getComponent() {
  return render(<Home />);
}

describe('Home', () => {
  test('it renders', async () => {
    const { getByText } = getComponent();
    expect(getByText('Accept').textContent).toBeDefined();
  });
});

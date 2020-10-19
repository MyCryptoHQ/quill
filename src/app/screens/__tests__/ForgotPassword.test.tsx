import React from 'react';

import { fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';

import { createStore } from '@app/store';
import { ipcBridgeRenderer } from '@bridge';
import { DBRequestType } from '@types';

import { ForgotPassword } from '../ForgotPassword';

const mockReplace = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    replace: mockReplace
  })
}));

jest.mock('@bridge', () => ({
  ipcBridgeRenderer: {
    db: { invoke: jest.fn() }
  }
}));

function getComponent() {
  return render(
    <Router>
      <Provider store={createStore()}>
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
    expect(mockReplace).toHaveBeenCalled();
  });

  it('can cancel', async () => {
    const { getByText } = getComponent();
    const cancelButton = getByText('No');
    expect(cancelButton).toBeDefined();
    fireEvent.click(cancelButton);

    expect(mockReplace).toHaveBeenCalled();
  });
});

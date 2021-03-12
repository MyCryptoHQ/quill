import React from 'react';

import { DeepPartial, EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { ApplicationState, createPassword } from '@app/store';
import { CreatePassword } from '@screens';
import { translateRaw } from '@translations';

jest.mock('@bridge', () => ({
  ipcBridgeRenderer: {
    db: {
      invoke: jest.fn().mockImplementation((password: string) => password === 'password')
    }
  }
}));

const RANDOM_PASSWORD = '4hmTwcgCgJXZyN&k$bA8';
const createMockStore = configureStore<DeepPartial<ApplicationState>>();

const getComponent = (store: EnhancedStore<DeepPartial<ApplicationState>> = createMockStore()) => {
  return render(
    <MemoryRouter>
      <Provider store={store}>
        <CreatePassword />
      </Provider>
    </MemoryRouter>
  );
};

describe('CreatePassword', () => {
  it('renders', async () => {
    const mockStore = createMockStore({
      auth: {}
    });

    const { getByText } = getComponent(mockStore);
    expect(getByText(translateRaw('CREATE_PASSWORD')).textContent).toBeDefined();
  });

  it('dispatches createPassword on submit', async () => {
    const mockStore = createMockStore({
      auth: {}
    });

    const { getByLabelText, getByText } = getComponent(mockStore);
    const passwordInput = getByLabelText(translateRaw('ENTER_PASSWORD'));
    expect(passwordInput).toBeDefined();
    fireEvent.change(passwordInput, { target: { value: RANDOM_PASSWORD } });

    const passwordConfirmationInput = getByLabelText(translateRaw('CONFIRM_PASSWORD'));
    expect(passwordConfirmationInput).toBeDefined();
    fireEvent.change(passwordConfirmationInput, { target: { value: RANDOM_PASSWORD } });

    const createButton = getByText(translateRaw('CREATE_PASSWORD'));
    expect(createButton).toBeDefined();
    await waitFor(() => fireEvent.click(createButton));

    expect(mockStore.getActions()).toContainEqual(createPassword(RANDOM_PASSWORD));
  });

  it('does not submit on mismatching passwords', async () => {
    const mockStore = createMockStore({
      auth: {}
    });

    const { getByLabelText, getByText } = getComponent(mockStore);
    const passwordInput = getByLabelText(translateRaw('ENTER_PASSWORD'));
    expect(passwordInput).toBeDefined();
    fireEvent.change(passwordInput, { target: { value: RANDOM_PASSWORD } });

    const createButton = getByText(translateRaw('CREATE_PASSWORD'));
    expect(createButton).toBeDefined();
    await waitFor(() => fireEvent.click(createButton));

    expect(mockStore.getActions()).not.toContainEqual(createPassword(RANDOM_PASSWORD));
  });

  it('does not submit on weak passwords', async () => {
    const mockStore = createMockStore({
      auth: {}
    });

    const { getByLabelText, getByText } = getComponent(mockStore);
    const passwordInput = getByLabelText(translateRaw('ENTER_PASSWORD'));
    expect(passwordInput).toBeDefined();
    fireEvent.change(passwordInput, { target: { value: 'foo' } });

    const passwordConfirmationInput = getByLabelText(translateRaw('CONFIRM_PASSWORD'));
    expect(passwordConfirmationInput).toBeDefined();
    fireEvent.change(passwordConfirmationInput, { target: { value: 'foo' } });

    const createButton = getByText(translateRaw('CREATE_PASSWORD'));
    expect(createButton).toBeDefined();
    await waitFor(() => fireEvent.click(createButton));

    expect(mockStore.getActions()).not.toContainEqual(createPassword('foo'));
  });
});

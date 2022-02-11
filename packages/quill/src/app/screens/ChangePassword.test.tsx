import { changePassword, translateRaw } from '@quill/common';
import type { DeepPartial, EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { ThemeProvider } from 'styled-components';

import type { ApplicationState } from '@store';
import { theme } from '@theme';

import { ChangePassword } from './ChangePassword';

const createMockStore = configureStore<DeepPartial<ApplicationState>>();

const getComponent = (store: EnhancedStore<DeepPartial<ApplicationState>>) => {
  return render(
    <MemoryRouter>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <ChangePassword />
        </ThemeProvider>
      </Provider>
    </MemoryRouter>
  );
};

const RANDOM_PASSWORD = '4hmTwcgCgJXZyN&k$bA8';

describe('ChangePassword', () => {
  it('dispatches changePassword on submit', async () => {
    const mockStore = createMockStore({
      auth: {}
    });

    const { getByLabelText, getByText } = getComponent(mockStore);

    const currentPasswordInput = getByLabelText(translateRaw('ENTER_CURRENT_PASSWORD'));
    fireEvent.change(currentPasswordInput, { target: { value: 'foo' } });

    const passwordInput = getByLabelText(translateRaw('NEW_PASSWORD'));
    fireEvent.change(passwordInput, { target: { value: RANDOM_PASSWORD } });

    const passwordConfirmationInput = getByLabelText(translateRaw('CONFIRM_NEW_PASSWORD'));
    fireEvent.change(passwordConfirmationInput, { target: { value: RANDOM_PASSWORD } });

    const createButton = getByText(translateRaw('CHANGE_PASSWORD'));
    expect(createButton).toBeDefined();
    fireEvent.click(createButton);

    await waitFor(() =>
      expect(mockStore.getActions()).toContainEqual(
        changePassword({ currentPassword: 'foo', password: RANDOM_PASSWORD })
      )
    );
  });

  it('validates the input', async () => {
    const mockStore = createMockStore({
      auth: {}
    });

    const { getByText } = getComponent(mockStore);

    const createButton = getByText(translateRaw('CHANGE_PASSWORD'));
    expect(createButton).toBeDefined();
    fireEvent.click(createButton);

    await waitFor(() =>
      expect(mockStore.getActions()).not.toContainEqual(
        changePassword({ currentPassword: 'foo', password: RANDOM_PASSWORD })
      )
    );
  });

  it('shows errors', async () => {
    const mockStore = createMockStore({
      auth: {
        error: 'Error: foo'
      }
    });

    const { getByText } = getComponent(mockStore);

    await waitFor(() => expect(getByText('Error: foo')).toBeDefined());
  });
});

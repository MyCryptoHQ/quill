import type { EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, render } from '@testing-library/react';
import { push } from 'connected-react-router';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { ThemeProvider } from 'styled-components';

import { ROUTE_PATHS } from '@routing';
import type { ApplicationState } from '@store';
import { setGeneratedAccount } from '@store';
import { theme } from '@theme';
import type { DeepPartial } from '@types';

import { GenerateAccount } from './GenerateAccount';

jest.mock('./GenerateAccountEnd', () => ({
  GenerateAccountEnd: ({ onNext }: { onNext(): void }) => (
    <button data-testid="next-button" onClick={onNext} />
  )
}));

jest.mock('./GenerateAccountMnemonic', () => ({
  GenerateAccountMnemonic: ({ onNext }: { onNext(): void }) => (
    <button data-testid="next-button" onClick={onNext} />
  )
}));

jest.mock('./GenerateAccountStart', () => ({
  GenerateAccountStart: ({ onNext }: { onNext(): void }) => (
    <button data-testid="next-button" onClick={onNext} />
  )
}));

jest.mock('./GenerateAccountVerify', () => ({
  GenerateAccountVerify: ({ onNext }: { onNext(): void }) => (
    <button data-testid="next-button" onClick={onNext} />
  )
}));

const createMockStore = configureStore<DeepPartial<ApplicationState>>();

const getComponent = (store: EnhancedStore<DeepPartial<ApplicationState>> = createMockStore()) => {
  return render(
    <MemoryRouter>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <GenerateAccount />
        </ThemeProvider>
      </Provider>
    </MemoryRouter>
  );
};

describe('GenerateAccount', () => {
  it('clears the generated account on unmount', () => {
    const store = createMockStore();
    const { unmount } = getComponent(store);
    unmount();

    expect(store.getActions()).toContainEqual(setGeneratedAccount(undefined));
  });

  it('navigates to home when done', () => {
    const store = createMockStore();
    const { getByTestId } = getComponent(store);

    fireEvent.click(getByTestId('next-button'));
    fireEvent.click(getByTestId('next-button'));
    fireEvent.click(getByTestId('next-button'));
    fireEvent.click(getByTestId('next-button'));

    expect(store.getActions()).toContainEqual(push(ROUTE_PATHS.HOME));
  });
});

import { setGeneratedAccount } from '@quill/common';
import type { DeepPartial } from '@quill/common';
import type { EnhancedStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import { push } from 'connected-react-router';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { ThemeProvider } from 'styled-components';

import { ROUTE_PATHS } from '@routing';
import type { ApplicationState } from '@store';
import { theme } from '@theme';

import { GenerateAccount } from './GenerateAccount';

jest.mock('./GenerateAccountPrint', () => ({
  GenerateAccountPrint: ({ onNext }: { onNext(): void }) => (
    <button data-testid="next-button" onClick={onNext} />
  )
}));

jest.mock('./GenerateAccountAddress', () => ({
  GenerateAccountAddress: ({ onNext }: { onNext(): void }) => (
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
    const store = createMockStore({ flow: 6 });
    getComponent(store);

    expect(store.getActions()).toContainEqual(push(ROUTE_PATHS.HOME));
  });
});

import { translateRaw } from '@quill/common';
import type { DeepPartial } from '@quill/common';
import type { EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { ThemeProvider } from 'styled-components';

import { fGeneratedAccount } from '@fixtures';
import type { ApplicationState } from '@store';
import { theme } from '@theme';

import { GenerateAccountAddress } from './GenerateAccountAddress';

const createMockStore = configureStore<DeepPartial<ApplicationState>>();

const getComponent = (
  store: EnhancedStore<DeepPartial<ApplicationState>> = createMockStore(),
  onNext = jest.fn()
) => {
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <Provider store={store}>
          <GenerateAccountAddress
            onNext={onNext}
            onPrevious={jest.fn()}
            onReset={jest.fn()}
            flowHeader={<></>}
          />
        </Provider>
      </MemoryRouter>
    </ThemeProvider>
  );
};

describe('GenerateAccountAddress', () => {
  it('renders', () => {
    const { getByText } = getComponent(
      createMockStore({
        accounts: {
          generatedAccount: fGeneratedAccount
        }
      })
    );
    expect(getByText(translateRaw('NEW_ACCOUNT_TITLE'))).toBeDefined();
  });

  it('shows the address and mnemonic phrase', () => {
    const { getByText, getAllByText } = getComponent(
      createMockStore({
        accounts: {
          generatedAccount: fGeneratedAccount
        }
      })
    );

    expect(getAllByText(fGeneratedAccount.address)).toBeDefined();

    const button = getByText(translateRaw('CLICK_TO_SHOW'));
    fireEvent.click(button);

    expect(getAllByText(fGeneratedAccount.mnemonicPhrase)).toHaveLength(1);
  });

  it('dispatches addGeneratedAccount when clicking the button', () => {
    const onNext = jest.fn();
    const { getByText } = getComponent(
      createMockStore({
        accounts: {
          generatedAccount: fGeneratedAccount
        }
      }),
      onNext
    );

    const button = getByText(translateRaw('NEXT'));
    fireEvent.click(button);

    expect(onNext).toHaveBeenCalledTimes(1);
  });
});

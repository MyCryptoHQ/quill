import { addGeneratedAccount, translateRaw } from '@quill/common';
import type { DeepPartial } from '@quill/common';
import type { EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { toPng } from 'html-to-image';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { fGeneratedAccount } from '@fixtures';
import type { ApplicationState } from '@store';

import { GenerateAccountPrint } from './GenerateAccountPrint';

jest.mock('html-to-image', () => ({
  toPng: jest.fn().mockImplementation(async () => 'foo bar')
}));

const createMockStore = configureStore<DeepPartial<ApplicationState>>();

const getComponent = (
  store: EnhancedStore<DeepPartial<ApplicationState>> = createMockStore(),
  onNext = jest.fn()
) => {
  return render(
    <MemoryRouter>
      <Provider store={store}>
        <GenerateAccountPrint
          onNext={onNext}
          onPrevious={jest.fn()}
          onReset={jest.fn()}
          flowHeader={<></>}
        />
      </Provider>
    </MemoryRouter>
  );
};

describe('GenerateAccountPrint', () => {
  it('renders', () => {
    const { getByText } = getComponent(
      createMockStore({
        accounts: {
          generatedAccount: fGeneratedAccount
        }
      })
    );
    expect(getByText(translateRaw('GENERATE_ACCOUNT_PRINT_HEADER'))).toBeDefined();
  });

  it('generates a paper wallet', async () => {
    const { getByTestId } = getComponent(
      createMockStore({
        accounts: {
          generatedAccount: fGeneratedAccount
        }
      })
    );

    await waitFor(() => expect(toPng).toHaveBeenCalled());
    expect(getByTestId('download-link').getAttribute('href')).toBe('foo bar');
  });

  it('dispatches addGeneratedAccount when clicking the button', () => {
    const mockStore = createMockStore({
      accounts: {
        generatedAccount: fGeneratedAccount
      }
    });
    const { getByText } = getComponent(mockStore);

    const button = getByText(translateRaw('PAPER_WALLET_PRINTED'));
    fireEvent.click(button);

    expect(mockStore.getActions()).toContainEqual(addGeneratedAccount());
  });
});

import { Image } from '@mycrypto/ui';
import { addGeneratedAccount, translateRaw } from '@quill/common';
import type { DeepPartial } from '@quill/common';
import type { EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { toPng } from 'html-to-image';
import type { SyntheticEvent } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { fGeneratedAccount } from '@fixtures';
import type { ApplicationState } from '@store';

import { GenerateAccountPrint } from './GenerateAccountPrint';

jest.mock('html-to-image', () => ({
  toPng: jest.fn().mockImplementation(async () => 'foo bar')
}));

jest.mock('@mycrypto/ui', () => ({
  ...jest.requireActual('@mycrypto/ui'),
  Image: jest.fn().mockReturnValue(null)
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

beforeEach(() => {
  jest.clearAllMocks();
});

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

    const mock = Image as jest.MockedFunction<typeof Image>;
    const onLoad = mock.mock.calls[0][0].onLoad;
    onLoad({} as SyntheticEvent<HTMLImageElement, Event>);

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

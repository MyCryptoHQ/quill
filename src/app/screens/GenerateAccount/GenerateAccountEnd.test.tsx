import React from 'react';

import { EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, render, waitFor } from '@testing-library/react';
import html2canvas from 'html2canvas';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { ApplicationState } from '@store';
import { translateRaw } from '@translations';
import { DeepPartial } from '@types';

import { GenerateAccountEnd } from './GenerateAccountEnd';

jest.mock('html2canvas', () =>
  jest.fn().mockImplementation(async () => ({
    toDataURL: jest.fn().mockImplementation(() => 'foo bar')
  }))
);

const createMockStore = configureStore<DeepPartial<ApplicationState>>();

const getComponent = (
  store: EnhancedStore<DeepPartial<ApplicationState>> = createMockStore(),
  onNext = jest.fn()
) => {
  return render(
    <MemoryRouter>
      <Provider store={store}>
        <GenerateAccountEnd onNext={onNext} onPrevious={jest.fn()} onReset={jest.fn()} />
      </Provider>
    </MemoryRouter>
  );
};

describe('GenerateAccountEnd', () => {
  it('renders', () => {
    const { getByText } = getComponent(
      createMockStore({
        accounts: {
          generatedAccount: {
            mnemonicPhrase: 'test test test test test test test test test test test ball',
            address: '0xc6D5a3c98EC9073B54FA0969957Bd582e8D874bf'
          }
        }
      })
    );
    expect(getByText(translateRaw('NEW_ACCOUNT_TITLE'))).toBeDefined();
  });

  it('generates a paper wallet', async () => {
    (html2canvas as jest.MockedFunction<typeof html2canvas>).mockClear();

    const { getByTestId } = getComponent(
      createMockStore({
        accounts: {
          generatedAccount: {
            mnemonicPhrase: 'test test test test test test test test test test test ball',
            address: '0xc6D5a3c98EC9073B54FA0969957Bd582e8D874bf'
          }
        }
      })
    );

    await waitFor(() => expect(html2canvas).toHaveBeenCalled());
    expect(getByTestId('download-link').getAttribute('href')).toBe('foo bar');
  });

  it('shows the address and mnemonic phrase', () => {
    const mnemonicPhrase = 'test test test test test test test test test test test ball';
    const address = '0xc6D5a3c98EC9073B54FA0969957Bd582e8D874bf';

    const { getByText, getAllByText } = getComponent(
      createMockStore({
        accounts: {
          generatedAccount: {
            mnemonicPhrase,
            address
          }
        }
      })
    );

    expect(getAllByText(address)).toBeDefined();

    const button = getByText(translateRaw('CLICK_TO_SHOW'));
    fireEvent.click(button);

    expect(getAllByText(mnemonicPhrase)).toHaveLength(2);
  });

  it('calls onNext when clicking the button', () => {
    const onNext = jest.fn();
    const { getByText } = getComponent(
      createMockStore({
        accounts: {
          generatedAccount: {
            mnemonicPhrase: 'test test test test test test test test test test test ball',
            address: '0xc6D5a3c98EC9073B54FA0969957Bd582e8D874bf'
          }
        }
      }),
      onNext
    );

    const button = getByText(translateRaw('PAPER_WALLET_PRINTED'));
    fireEvent.click(button);

    expect(onNext).toHaveBeenCalledTimes(1);
  });
});

import React from 'react';

import { EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { ApplicationState } from '@store';
import { translateRaw } from '@translations';
import { DeepPartial } from '@types';

import { GenerateAccountEnd } from './GenerateAccountEnd';

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

import React from 'react';

import { EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { ApplicationState } from '@store';
import { translateRaw } from '@translations';
import { DeepPartial } from '@types';

import { GenerateAccountVerify } from './GenerateAccountVerify';

const createMockStore = configureStore<DeepPartial<ApplicationState>>();

const getComponent = (
  store: EnhancedStore<DeepPartial<ApplicationState>> = createMockStore(),
  onNext = jest.fn()
) => {
  return render(
    <MemoryRouter>
      <Provider store={store}>
        <GenerateAccountVerify onNext={onNext} onPrevious={jest.fn()} onReset={jest.fn()} />
      </Provider>
    </MemoryRouter>
  );
};

describe('GenerateAccountVerify', () => {
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
    expect(getByText(translateRaw('VERIFY_MNEMONIC_PHRASE_TITLE'))).toBeDefined();
  });

  it('verifies the input', async () => {
    const onNext = jest.fn();
    const { getByTestId, getByText } = getComponent(
      createMockStore({
        accounts: {
          generatedAccount: {
            mnemonicPhrase: 'test test test test test foo test bar test test test baz',
            address: '0xc6D5a3c98EC9073B54FA0969957Bd582e8D874bf'
          }
        }
      }),
      onNext
    );

    const button = getByText(translateRaw('VERIFY_WORDS'));

    fireEvent.change(getByTestId('sixthWord'), { target: { value: 'foo' } });
    fireEvent.change(getByTestId('eighthWord'), { target: { value: 'bar' } });
    fireEvent.change(getByTestId('twelfthWord'), { target: { value: 'baz' } });

    fireEvent.click(button);

    await waitFor(() => expect(onNext).toHaveBeenCalledTimes(1));
  });
});

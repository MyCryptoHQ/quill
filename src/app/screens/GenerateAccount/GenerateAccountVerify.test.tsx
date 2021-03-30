import React from 'react';

import { EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { mockRandom } from 'jest-mock-random';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { fOtherMnemonicPhrase } from '@fixtures';
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
    mockRandom([
      0.72,
      0.42,
      0.46,
      0.33,
      0.81,
      0.63,
      0.79,
      0.1,
      0.84,
      0.49,
      0.77,
      0.01,
      0.49,
      0.84,
      0.6,
      0.5,
      0.82,
      0.45,
      0.29,
      0.53,
      0.5,
      0.7,
      0.91,
      0.98
    ]);

    const onNext = jest.fn();
    const { getByTestId, getByText } = getComponent(
      createMockStore({
        accounts: {
          generatedAccount: {
            mnemonicPhrase: fOtherMnemonicPhrase,
            address: '0xc6D5a3c98EC9073B54FA0969957Bd582e8D874bf'
          }
        }
      }),
      onNext
    );

    const button = getByText(translateRaw('VERIFY_WORDS'));
    fireEvent.click(button);
    expect(onNext).not.toHaveBeenCalled();

    fireEvent.change(getByTestId('firstWord'), { target: { value: 'scan' } });
    fireEvent.change(getByTestId('secondWord'), { target: { value: 'weekend' } });
    fireEvent.change(getByTestId('thirdWord'), { target: { value: 'guide' } });

    fireEvent.click(button);
    await waitFor(() => expect(onNext).toHaveBeenCalled());
  });
});

import type { EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { mockRandomForEach } from 'jest-mock-random';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { translateRaw } from '@common/translate';
import { fOtherMnemonicPhrase } from '@fixtures';
import type { ApplicationState } from '@store';
import type { DeepPartial } from '@types';

import { GenerateAccountVerify } from './GenerateAccountVerify';

const createMockStore = configureStore<DeepPartial<ApplicationState>>();

const getComponent = (
  store: EnhancedStore<DeepPartial<ApplicationState>> = createMockStore(),
  onNext = jest.fn()
) => {
  return render(
    <MemoryRouter>
      <Provider store={store}>
        <GenerateAccountVerify
          onNext={onNext}
          onPrevious={jest.fn()}
          onReset={jest.fn()}
          flowHeader={<></>}
        />
      </Provider>
    </MemoryRouter>
  );
};

describe('GenerateAccountVerify', () => {
  mockRandomForEach([
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

  it('renders', () => {
    const { getByText } = getComponent(
      createMockStore({
        accounts: {
          generatedAccount: {
            mnemonicPhrase: fOtherMnemonicPhrase,
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

  it('shows an error on invalid input', async () => {
    const onNext = jest.fn();
    const { getByTestId, getByText, findByText } = getComponent(
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

    fireEvent.change(getByTestId('firstWord'), { target: { value: 'foo' } });
    fireEvent.change(getByTestId('secondWord'), { target: { value: 'bar' } });
    fireEvent.change(getByTestId('thirdWord'), { target: { value: 'guide' } });

    const button = getByText(translateRaw('VERIFY_WORDS'));
    fireEvent.click(button);

    await expect(
      findByText(translateRaw('NOT_NTH_WORD', { $nth: translateRaw('ORDINAL_7') }))
    ).resolves.toBeDefined();
    await expect(
      findByText(translateRaw('NOT_NTH_WORD', { $nth: translateRaw('ORDINAL_11') }))
    ).resolves.toBeDefined();
    await expect(
      findByText(translateRaw('NOT_NTH_WORD', { $nth: translateRaw('ORDINAL_18') }))
    ).rejects.toThrow();
    expect(onNext).not.toHaveBeenCalled();
  });
});

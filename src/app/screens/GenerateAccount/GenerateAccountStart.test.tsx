import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import { GenerateAccountStart } from '@screens/GenerateAccount/GenerateAccountStart';
import { translateRaw } from '@translations';

describe('GenerateAccountStart', () => {
  it('renders', () => {
    const { getByText } = render(
      <GenerateAccountStart onNext={jest.fn()} onPrevious={jest.fn()} onReset={jest.fn()} />
    );
    expect(getByText(translateRaw('GENERATE_ACCOUNT_MNEMONIC'))).toBeDefined();
  });

  it('calls onNext when clicking the button', () => {
    const onNext = jest.fn();
    const { getByText } = render(
      <GenerateAccountStart onNext={onNext} onPrevious={jest.fn()} onReset={jest.fn()} />
    );

    const button = getByText(translateRaw('CREATE_MNEMONIC_PHRASE'));
    fireEvent.click(button);

    expect(onNext).toHaveBeenCalledTimes(1);
  });
});

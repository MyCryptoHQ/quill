import { fireEvent, render } from '@testing-library/react';

import { translateRaw } from '@common/translate';

import { GenerateAccountStart } from './GenerateAccountStart';

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

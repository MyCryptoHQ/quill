import { fireEvent, render } from '@testing-library/react';
import type { ComponentProps } from 'react';
import selectEvent from 'react-select-event';

import { translateRaw } from '@common/translate';
import { fAccount, fAccounts } from '@fixtures';

import { AccountSelector } from './AccountSelector';

const getComponent = (props: ComponentProps<typeof AccountSelector>) => {
  return render(<AccountSelector {...props} />);
};

describe('AccountSelector', () => {
  it('shows the current account', () => {
    const { findByText } = getComponent({
      currentAccount: fAccount.uuid,
      accounts: fAccounts,
      onChange: jest.fn()
    });

    expect(findByText(fAccount.address)).toBeDefined();
  });

  it('calls onChange when changing account', async () => {
    const onChange = jest.fn();
    const { getByText } = getComponent({
      currentAccount: null,
      accounts: fAccounts,
      onChange
    });

    const selector = getByText(translateRaw('SELECT_ACCOUNT'));
    selectEvent.openMenu(selector);

    const account = getByText(fAccounts[1].address);
    fireEvent.click(account);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0]).toContainEqual(fAccounts[1]);
  });
});

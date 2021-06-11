import { translateRaw } from '@signer/common';
import type { IAccount, TUuid } from '@signer/common';
import type { OptionProps } from 'react-select';

import { Account, Selector } from '@components';

interface Props {
  currentAccount: TUuid;
  accounts: IAccount[];
  onChange(account: IAccount): void;
}

const AccountOption = ({ data, selectOption }: OptionProps<IAccount>) => {
  const handleSelect = () => selectOption(data);

  return (
    <Account
      address={data.address}
      label={data.label}
      truncate={false}
      bg="none"
      onClick={handleSelect}
    />
  );
};

const AccountValue = ({ value }: { value: IAccount }) => (
  <Account address={value.address} label={value.label} truncate={true} bg="none" />
);

export const AccountSelector = ({ currentAccount, accounts, onChange }: Props) => {
  const getOptionLabel = (option: IAccount) => option.label;

  const account = accounts.find((a) => a.uuid === currentAccount);

  return (
    <Selector
      placeholder={translateRaw('SELECT_ACCOUNT')}
      options={accounts}
      value={account}
      optionComponent={AccountOption}
      valueComponent={AccountValue}
      onChange={onChange}
      getOptionLabel={getOptionLabel}
      searchable={false}
      name="accounts"
    />
  );
};

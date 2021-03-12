import React from 'react';

import { useSelector } from 'react-redux';

import { getAccounts, removeAccount, useDispatch } from '@app/store';
import { translateRaw } from '@translations';
import { IAccount } from '@types';

const DeleteAccountButton = ({ account }: { account: IAccount }) => {
  const dispatch = useDispatch();
  const handleDelete = () => dispatch(removeAccount(account));

  return (
    <button data-testid={`delete-${account.address}`} onClick={handleDelete}>
      {translateRaw('DELETE')}
    </button>
  );
};

export const Accounts = () => {
  const accounts = useSelector(getAccounts);

  return (
    <>
      {accounts.map((a) => (
        <div key={a.uuid}>
          {a.address}
          <DeleteAccountButton account={a} />
        </div>
      ))}
    </>
  );
};

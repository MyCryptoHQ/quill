import React from 'react';

import { useSelector } from 'react-redux';

import { getAccounts, removeAccount, useDispatch } from '@app/store';
import { translateRaw } from '@translations';

export const Accounts = () => {
  const accounts = useSelector(getAccounts);
  const dispatch = useDispatch();

  return (
    <>
      {accounts.map((a) => (
        <div key={a.uuid}>
          {a.address}
          <button data-testid={`delete-${a.address}`} onClick={() => dispatch(removeAccount(a))}>
            {translateRaw('DELETE')}
          </button>
        </div>
      ))}
    </>
  );
};

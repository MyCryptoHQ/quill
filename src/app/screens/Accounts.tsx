import React from 'react';

import { Link } from 'react-router-dom';

import { useAccounts } from '@app/hooks';
import { ROUTE_PATHS } from '@app/routing';

export const Accounts = () => {
  const { accounts, removeAccount } = useAccounts();

  return (
    <>
      <Link to={ROUTE_PATHS.HOME}>Back</Link>
      <br />
      {accounts.map((a, index) => (
        <div key={index}>
          {a.address}
          <button data-testid={`delete-${a.address}`} onClick={() => removeAccount(a)}>
            Delete
          </button>
        </div>
      ))}
    </>
  );
};

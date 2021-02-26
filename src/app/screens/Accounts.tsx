import React from 'react';

import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { ROUTE_PATHS } from '@app/routing';
import { getAccounts, removeAccount, useDispatch } from '@app/store';

export const Accounts = () => {
  const accounts = useSelector(getAccounts);
  const dispatch = useDispatch();

  return (
    <>
      <Link to={ROUTE_PATHS.HOME}>Back</Link>
      <br />
      {accounts.map((a, index) => (
        <div key={index}>
          {a.address}
          <button data-testid={`delete-${a.address}`} onClick={() => dispatch(removeAccount(a))}>
            Delete
          </button>
        </div>
      ))}
    </>
  );
};

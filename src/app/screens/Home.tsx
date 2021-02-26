import React from 'react';

import { getQueueLength } from '@store/transactions.slice';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { ROUTE_PATHS } from '@app/routing';
import { getAccounts, getCurrentTransaction } from '@app/store';
import { makeTx } from '@utils';

import { SignTransaction } from './SignTransaction';

export const Home = () => {
  const accounts = useSelector(getAccounts);
  const currentTransaction = useSelector(getCurrentTransaction);
  const transactionQueueLength = useSelector(getQueueLength);
  const formattedTx = currentTransaction && makeTx(currentTransaction);
  const currentAccount = formattedTx && accounts.find((a) => a.address === formattedTx.from);

  return (
    <div>
      {`Current Account: ${currentAccount && currentAccount.address}`}
      <Link to={ROUTE_PATHS.ADD_ACCOUNT}>+</Link>
      <Link to={ROUTE_PATHS.ACCOUNTS}>Manage</Link>
      <br />
      {transactionQueueLength > 1 && (
        <>
          {`TXs in queue: ${transactionQueueLength}`}
          <br />
        </>
      )}
      <SignTransaction />
    </div>
  );
};

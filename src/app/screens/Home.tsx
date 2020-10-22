import React from 'react';

import { Link } from 'react-router-dom';

import { useAccounts } from '@app/hooks';
import { ROUTE_PATHS } from '@app/routing';
import { useApiService } from '@app/services';
import { makeTx } from '@utils';

import { SignTransaction } from './SignTransaction';

export const Home = () => {
  const { currentTx, txQueueLength } = useApiService();
  const { accounts } = useAccounts();
  const formattedTx = currentTx && makeTx(currentTx);
  const currentAccount = formattedTx && accounts.find((a) => a.address === formattedTx.from);

  return (
    <div>
      {`Current Account: ${currentAccount && currentAccount.address}`}
      <Link to={ROUTE_PATHS.ADD_ACCOUNT}>+</Link>
      <Link to={ROUTE_PATHS.ACCOUNTS}>Manage</Link>
      <br />
      {txQueueLength > 1 && (
        <>
          {`TXs in queue: ${txQueueLength}`}
          <br />
        </>
      )}
      <SignTransaction />
    </div>
  );
};

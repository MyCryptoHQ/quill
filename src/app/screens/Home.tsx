import React from 'react';

import { getQueueLength, getTxHistory } from '@store/transactions.slice';
import { useSelector } from 'react-redux';

import { getAccounts, getCurrentTransaction } from '@app/store';
import { makeTx } from '@utils';

import { SignTransaction } from './SignTransaction';

export const Home = () => {
  const accounts = useSelector(getAccounts);
  const currentTransaction = useSelector(getCurrentTransaction);
  const transactionQueueLength = useSelector(getQueueLength);
  const txHistory = useSelector(getTxHistory);
  const formattedTx = currentTransaction && makeTx(currentTransaction);
  const currentAccount = formattedTx && accounts.find((a) => a.address === formattedTx.from);

  return (
    <div>
      {`Current Account: ${currentAccount && currentAccount.address}`}
      <br />
      {transactionQueueLength > 1 && (
        <>
          {`TXs in queue: ${transactionQueueLength}`}
          <br />
        </>
      )}
      <SignTransaction />
      {`History: ${JSON.stringify(txHistory)}`}
    </div>
  );
};

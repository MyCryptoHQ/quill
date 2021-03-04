import React from 'react';

import { getQueue, getTxHistory } from '@store/transactions.slice';
import { useSelector } from 'react-redux';

import { TxHistory, TxQueue } from '@app/components';
import { getAccounts, getCurrentTransaction } from '@app/store';
import { makeTx } from '@utils';

export const Home = () => {
  const accounts = useSelector(getAccounts);
  const queue = useSelector(getQueue)
  const currentTransaction = useSelector(getCurrentTransaction);
  const txHistory = useSelector(getTxHistory);
  const formattedTx = currentTransaction && makeTx(currentTransaction);
  const currentAccount = formattedTx && accounts.find((a) => a.address === formattedTx.from);

  return (
    <div>
      {`Current Account: ${currentAccount && currentAccount.address}`}
      <br />
      <TxQueue queue={queue} />
      <TxHistory history={txHistory} />
    </div>
  );
};

import React from 'react';

import { getQueue, getTxHistory } from '@store/transactions.slice';
import { useSelector } from 'react-redux';

import { TxHistory, TxQueue } from '@app/components';

export const Home = () => {
  const queue = useSelector(getQueue);
  const txHistory = useSelector(getTxHistory);

  return (
    <>
      {queue.length === 0 && txHistory.length === 0 ? (
        <>There are no transactions in your Signer at this time</>
      ) : (
        <>
          <TxQueue queue={queue} />
          <TxHistory history={txHistory} />
        </>
      )}
    </>
  );
};

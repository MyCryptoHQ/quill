import React from 'react';

import { getQueue, getTxHistory } from '@store/transactions.slice';
import { useSelector } from 'react-redux';

import { TxHistory, TxQueue } from '@app/components';

export const Home = () => {
  const queue = useSelector(getQueue);
  const txHistory = useSelector(getTxHistory);

  return (
    <div>
      <TxQueue queue={queue} />
      <TxHistory history={txHistory} />
    </div>
  );
};

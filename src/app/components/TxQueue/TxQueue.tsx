import React from 'react';

import { JsonRPCRequest, TSignTransaction } from '@types';

import { Divider } from '../Divider';
import { TxQueueCard } from './TxQueueCard';

export const TxQueue = ({ queue }: { queue: JsonRPCRequest<TSignTransaction>[] }) => (
  <>
    {queue.map((q) => (
      <>
        <TxQueueCard item={q} />
        <Divider />
      </>
    ))}
  </>
);

import React from 'react';

import { TxQueueEntry } from '@types';

import { Divider } from '../Divider';
import { TxQueueCard } from './TxQueueCard';

export const TxQueue = ({ queue }: { queue: TxQueueEntry[] }) => (
  <>
    {queue.map((q) => (
      <React.Fragment key={q.uuid}>
        <TxQueueCard item={q} />
        <Divider />
      </React.Fragment>
    ))}
  </>
);

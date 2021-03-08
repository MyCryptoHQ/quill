import React from 'react';

import { TxQueueEntry } from '@types';

import { Divider } from '../Divider';
import { TxQueueCard } from './TxQueueCard';

export const TxQueue = ({ queue }: { queue: TxQueueEntry[] }) => (
  <>
    {queue.map((q, i) => (
      <React.Fragment key={i}>
        <TxQueueCard item={q} />
        <Divider />
      </React.Fragment>
    ))}
  </>
);

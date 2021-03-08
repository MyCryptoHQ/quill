import React from 'react';

import { TxQueueEntry } from '@types';
import { generateUUID } from '@utils';

import { Divider } from '../Divider';
import { TxQueueCard } from './TxQueueCard';

export const TxQueue = ({ queue }: { queue: TxQueueEntry[] }) => (
  <>
    {queue.map((q) => (
      <React.Fragment key={generateUUID()}>
        <TxQueueCard item={q} />
        <Divider />
      </React.Fragment>
    ))}
  </>
);

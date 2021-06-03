import { Fragment } from 'react';

import type { TxQueueEntry } from '@types';

import { Divider } from '../Divider';
import { TxQueueCard } from './TxQueueCard';

export const TxQueue = ({ queue }: { queue: TxQueueEntry[] }) => (
  <>
    {queue
      .slice()
      .sort((a, b) => b.timestamp - a.timestamp)
      .map((q, index) => (
        <Fragment key={q.uuid}>
          <TxQueueCard item={q} first={index === 0} />
          <Divider />
        </Fragment>
      ))}
  </>
);

import { Fragment } from 'react';

import { TxQueueEntry } from '@types';

import { Divider } from '../Divider';
import { TxQueueCard } from './TxQueueCard';

export const TxQueue = ({ queue }: { queue: TxQueueEntry[] }) => (
  <>
    {queue
      .slice()
      .sort((a, b) => b.timestamp - a.timestamp)
      .map((q) => (
        <Fragment key={q.uuid}>
          <TxQueueCard item={q} />
          <Divider />
        </Fragment>
      ))}
  </>
);

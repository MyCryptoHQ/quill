import type { TxQueueEntry } from '@signer/common';
import { Fragment } from 'react';

import { Divider } from '../Divider';
import { TxQueueCard } from './TxQueueCard';

export const TxQueue = ({ queue }: { queue: TxQueueEntry[] }) => (
  <>
    {queue
      .slice()
      .sort((a, b) => b.receivedTimestamp - a.receivedTimestamp)
      .map((q, index) => (
        <Fragment key={q.uuid}>
          <TxQueueCard item={q} first={index === 0} />
          <Divider />
        </Fragment>
      ))}
  </>
);

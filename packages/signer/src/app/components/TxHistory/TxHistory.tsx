import { Fragment } from 'react';

import type { TxHistoryEntry } from '@types';

import { Divider } from '../Divider';
import { TxHistoryCard } from './TxHistoryCard';

export const TxHistory = ({ history }: { history: TxHistoryEntry[] }) => (
  <>
    {history
      .slice()
      .sort((a, b) => b.timestamp - a.timestamp)
      .map((h) => (
        <Fragment key={h.uuid}>
          <TxHistoryCard item={h} />
          <Divider />
        </Fragment>
      ))}
  </>
);

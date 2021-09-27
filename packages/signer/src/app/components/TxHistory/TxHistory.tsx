import type { TxHistoryEntry } from '@signer/common';
import { Fragment } from 'react';

import { Divider } from '../Divider';
import { TxHistoryCard } from './TxHistoryCard';

export const TxHistory = ({ history }: { history: TxHistoryEntry[] }) => (
  <>
    {history
      .slice()
      .sort((a, b) => b.actionTakenTimestamp - a.actionTakenTimestamp)
      .map((h) => (
        <Fragment key={h.uuid}>
          <TxHistoryCard item={h} />
          <Divider />
        </Fragment>
      ))}
  </>
);

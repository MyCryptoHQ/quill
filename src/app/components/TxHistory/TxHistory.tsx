import React from 'react';

import { TxHistoryEntry } from '@types';
import { generateUUID } from '@utils';

import { Divider } from '../Divider';
import { TxHistoryCard } from './TxHistoryCard';

export const TxHistory = ({ history }: { history: TxHistoryEntry[] }) => (
  <>
    {history
      .slice()
      .sort((a, b) => b.timestamp - a.timestamp)
      .map((h) => (
        <React.Fragment key={generateUUID()}>
          <TxHistoryCard item={h} />
          <Divider />
        </React.Fragment>
      ))}
  </>
);

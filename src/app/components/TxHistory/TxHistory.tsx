import React from 'react';

import { TxHistoryEntry } from '@types';

import { Divider } from '../Divider';
import { TxHistoryCard } from './TxHistoryCard';

export const TxHistory = ({ history }: { history: TxHistoryEntry[] }) => (
  <>
    {history.map((h) => (
      <>
        <TxHistoryCard item={h} />
        <Divider />
      </>
    ))}
  </>
);

import React from 'react';

import { TxHistoryEntry } from '@types';

import { TxHistoryCard } from './TxHistoryCard';
import { Divider } from '../Divider';

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

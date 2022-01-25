import type { TxHistoryEntry, TxQueueEntry } from '@quill/common';
import { getQueue, getTxHistory, isHistoryTx } from '@quill/common';
import { Fragment, useState } from 'react';

import { useSelector } from '@app/store';

import { Divider } from '../Divider';
import { Pagination } from '../Pagination';
import { TxHistoryCard } from './TxHistoryCard';
import { TxQueueCard } from './TxQueueCard';

const PENDING_HEIGHT = 178;
const HISTORY_HEIGHT = 56;
const MAX_HEIGHT = PENDING_HEIGHT * 5;

export const TxHistory = () => {
  const [page, setPage] = useState(0);
  const queue = useSelector(getQueue);
  const history = useSelector(getTxHistory);

  const sortedQueue = queue.slice().sort((a, b) => b.receivedTimestamp - a.receivedTimestamp);
  const sortedHistory = history
    .slice()
    .sort((a, b) => b.actionTakenTimestamp - a.actionTakenTimestamp);

  const combinedHistory = [...sortedQueue, ...sortedHistory];
  const groupedHistory = combinedHistory.reduce<(TxQueueEntry | TxHistoryEntry)[][]>((acc, cur) => {
    const height = isHistoryTx(cur) ? HISTORY_HEIGHT : PENDING_HEIGHT;
    const existingPage = acc[acc.length - 1] ?? [];
    const existingHeight = existingPage.reduce(
      (sum, tx) => sum + (isHistoryTx(tx) ? HISTORY_HEIGHT : PENDING_HEIGHT),
      0
    );

    if (existingHeight + height <= MAX_HEIGHT) {
      return [...acc.slice(0, -1), [...existingPage, cur]];
    }
    return [...acc, [cur]];
  }, []);
  const totalPages = groupedHistory.length;
  const historyPage = groupedHistory[page];

  const handleBack = () => setPage((page) => page - 1);

  const handleNext = () => setPage((page) => page + 1);

  return (
    <>
      {historyPage.map((h, index) => (
        <Fragment key={h.uuid}>
          {isHistoryTx(h) ? (
            <>
              <TxHistoryCard item={h} />
              <Divider />
            </>
          ) : (
            <TxQueueCard item={h} first={index === 0} />
          )}
        </Fragment>
      ))}
      <Pagination page={page} totalPages={totalPages} onBack={handleBack} onNext={handleNext} />
    </>
  );
};

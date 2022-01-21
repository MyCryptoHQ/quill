import { getQueue, getTxHistory, isHistoryTx } from '@quill/common';
import { Fragment, useState } from 'react';

import { useSelector } from '@app/store';

import { Divider } from '../Divider';
import { Pagination } from '../Pagination';
import { TxHistoryCard } from './TxHistoryCard';
import { TxQueueCard } from './TxQueueCard';

const ENTRIES_PER_PAGE = 5;

export const TxHistory = () => {
  const [page, setPage] = useState(0);
  const queue = useSelector(getQueue);
  const history = useSelector(getTxHistory);

  const sortedQueue = queue.slice().sort((a, b) => b.receivedTimestamp - a.receivedTimestamp);
  const sortedHistory = history
    .slice()
    .sort((a, b) => b.actionTakenTimestamp - a.actionTakenTimestamp);

  const combinedHistory = [...sortedQueue, ...sortedHistory];
  const totalPages = Math.ceil(combinedHistory.length / ENTRIES_PER_PAGE);
  const historyPage = combinedHistory.slice(
    page * ENTRIES_PER_PAGE,
    page * ENTRIES_PER_PAGE + ENTRIES_PER_PAGE
  );

  const handleBack = () => {
    setPage((page) => page - 1);
  };

  const handleNext = () => {
    setPage((page) => page + 1);
  };

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

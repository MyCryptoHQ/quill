import { getQueue, getTxHistory, isHistoryTx } from '@quill/common';
import { Fragment, useState } from 'react';

import { useSelector } from '@app/store';

import { Divider } from '../Divider';
import { Pagination } from '../Pagination';
import { paginateHistory } from './pagination';
import { TxHistoryCard } from './TxHistoryCard';
import { TxQueueCard } from './TxQueueCard';

export const TxHistory = () => {
  const [page, setPage] = useState(0);
  const queue = useSelector(getQueue);
  const history = useSelector(getTxHistory);

  const paginatedHistory = paginateHistory(queue, history);

  const totalPages = paginatedHistory.length;
  const historyPage = paginatedHistory[page];

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

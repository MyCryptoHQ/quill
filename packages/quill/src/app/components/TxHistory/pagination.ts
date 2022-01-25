import type { TxHistoryEntry, TxQueueEntry } from '@quill/common';
import { isHistoryTx } from '@quill/common';

const PENDING_HEIGHT = 178;
const HISTORY_HEIGHT = 56;
const MAX_HEIGHT = PENDING_HEIGHT * 5;

export const paginateHistory = (queue: TxQueueEntry[], history: TxHistoryEntry[]) => {
  const sortedQueue = queue.slice().sort((a, b) => b.receivedTimestamp - a.receivedTimestamp);
  const sortedHistory = history
    .slice()
    .sort((a, b) => b.actionTakenTimestamp - a.actionTakenTimestamp);

  const combinedHistory = [...sortedQueue, ...sortedHistory];
  return combinedHistory.reduce<(TxQueueEntry | TxHistoryEntry)[][]>((acc, cur) => {
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
};

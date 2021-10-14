import type { PersistConfig } from '@quill/common';
import {
  addToHistory,
  createPersistReducer,
  dequeue,
  enqueue,
  transactionsSlice,
  update
} from '@quill/common';

const persistConfig: PersistConfig = {
  key: transactionsSlice.name,
  whitelistedActions: [enqueue.type, update.type, dequeue.type, addToHistory.type],
  whitelistedKeys: ['queue', 'history']
};

export const persistedReducer = createPersistReducer(persistConfig, transactionsSlice.reducer);

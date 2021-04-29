import type { PersistConfig } from '@common/store';
import { addToHistory, createPersistReducer, dequeue, enqueue } from '@common/store';
import slice from '@common/store/transactions.slice';

const persistConfig: PersistConfig = {
  key: slice.name,
  whitelistedActions: [enqueue.type, dequeue.type, addToHistory.type],
  whitelistedKeys: ['queue', 'history']
};

export const persistedReducer = createPersistReducer(persistConfig, slice.reducer);

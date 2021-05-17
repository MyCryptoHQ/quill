import type { PersistConfig } from '@common/store';
import { addAccount, createPersistReducer, removeAccount, updateAccount } from '@common/store';
import slice from '@common/store/accounts.slice';

const persistConfig: PersistConfig = {
  key: slice.name,
  whitelistedActions: [addAccount.type, removeAccount.type, updateAccount.type],
  whitelistedKeys: ['accounts']
};

export const persistedReducer = createPersistReducer(persistConfig, slice.reducer);

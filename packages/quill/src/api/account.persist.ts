import {
  accountsSlice,
  addAccount,
  createPersistReducer,
  removeAccount,
  updateAccount
} from '@quill/common';
import type { PersistConfig } from '@quill/common';

const persistConfig: PersistConfig = {
  key: accountsSlice.name,
  whitelistedActions: [addAccount.type, removeAccount.type, updateAccount.type],
  whitelistedKeys: ['accounts']
};

export const persistedReducer = createPersistReducer(persistConfig, accountsSlice.reducer);

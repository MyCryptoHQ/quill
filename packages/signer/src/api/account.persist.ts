import {
  accountsSlice,
  addAccount,
  createPersistReducer,
  removeAccount,
  updateAccount
} from '@signer/common';
import type { PersistConfig } from '@signer/common';

const persistConfig: PersistConfig = {
  key: accountsSlice.name,
  whitelistedActions: [addAccount.type, removeAccount.type, updateAccount.type],
  whitelistedKeys: ['accounts']
};

export const persistedReducer = createPersistReducer(persistConfig, accountsSlice.reducer);

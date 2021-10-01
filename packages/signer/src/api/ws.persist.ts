import type { PersistConfig } from '@signer/common';
import { createPersistReducer, incrementNonce, wsSlice } from '@signer/common';

const persistConfig: PersistConfig = {
  key: wsSlice.name,
  whitelistedActions: [incrementNonce.type],
  whitelistedKeys: ['nonces']
};

export const persistedReducer = createPersistReducer(persistConfig, wsSlice.reducer);

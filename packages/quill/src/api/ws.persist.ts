import type { PersistConfig } from '@quill/common';
import { createPersistReducer, incrementNonce, wsSlice } from '@quill/common';

const persistConfig: PersistConfig = {
  key: wsSlice.name,
  whitelistedActions: [incrementNonce.type],
  whitelistedKeys: ['nonces']
};

export const persistedReducer = createPersistReducer(persistConfig, wsSlice.reducer);

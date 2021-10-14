import { appSettingsSlice, createPersistReducer, setAutoLockTimeout } from '@quill/common';

const persistConfig = {
  key: appSettingsSlice.name,
  whitelistedActions: [setAutoLockTimeout.type],
  whitelistedKeys: ['autoLockTimeout']
};

export const persistedReducer = createPersistReducer(persistConfig, appSettingsSlice.reducer);

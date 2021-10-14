import {
  createPersistReducer,
  grantPermission,
  permissionsSlice,
  revokePermission,
  updatePermission
} from '@quill/common';

const persistConfig = {
  key: permissionsSlice.name,
  whitelistedActions: [grantPermission.type, updatePermission.type, revokePermission.type],
  whitelistedKeys: ['permissions']
};

export const persistedReducer = createPersistReducer(persistConfig, permissionsSlice.reducer);

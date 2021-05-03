import { createPersistReducer } from '@common/store';
import slice, {
  grantPermission,
  revokePermission,
  updatePermission
} from '@common/store/permissions.slice';

const persistConfig = {
  key: slice.name,
  whitelistedActions: [grantPermission.type, updatePermission.type, revokePermission.type],
  whitelistedKeys: ['permissions']
};

export const persistedReducer = createPersistReducer(persistConfig, slice.reducer);

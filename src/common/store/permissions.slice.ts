import type { PayloadAction } from '@reduxjs/toolkit';
import { createSelector, createSlice } from '@reduxjs/toolkit';

import type { Permission } from '@types';

interface PermissionsState {
  permissions: Permission[];
  permissionRequest?: Permission;
}

const initialState: PermissionsState = { permissions: [], permissionRequest: undefined };

const sliceName = 'permissions';

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    grantPermission(state, action: PayloadAction<Permission>) {
      state.permissions.push(action.payload);
      state.permissionRequest = undefined;
    },
    updatePermission(state, action: PayloadAction<Permission>) {
      const idx = state.permissions.findIndex((p) => p.origin === action.payload.origin);
      state.permissions[idx] = action.payload;
    },
    revokePermission(state, action: PayloadAction<Permission>) {
      const idx = state.permissions.findIndex((p) => p.origin === action.payload.origin);
      state.permissions.splice(idx, 1);
    },
    requestPermission(state, action: PayloadAction<Permission>) {
      state.permissionRequest = action.payload;
    },
    denyPermission(state, _action: PayloadAction<Permission>) {
      state.permissionRequest = undefined;
    }
  }
});

export const {
  grantPermission,
  updatePermission,
  revokePermission,
  requestPermission,
  denyPermission
} = slice.actions;

export default slice;

export const getPermissionRequest = createSelector(
  (state: { permissions: PermissionsState }) => state.permissions,
  (permissions) => permissions.permissionRequest
);

export const getPermissions = createSelector(
  (state: { permissions: PermissionsState }) => state.permissions,
  (permissions) => permissions.permissions
);

export const hasExistingPermission = createSelector(
  getPermissions,
  getPermissionRequest,
  (permissions, request) => permissions.find((p) => p.origin === request.origin)
);

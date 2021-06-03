import { fPermission } from '@fixtures';

import slice, {
  denyPermission,
  grantPermission,
  requestPermission,
  revokePermission,
  updatePermission
} from './permissions.slice';

describe('Permissions', () => {
  describe('grantPermission()', () => {
    it('adds permission to state and resets permission request', () => {
      const result = slice.reducer(
        { permissions: [], permissionRequest: fPermission },
        grantPermission(fPermission)
      );
      expect(result.permissions).toStrictEqual([fPermission]);
      expect(result.permissionRequest).toBeUndefined();
    });
  });

  describe('updatePermission()', () => {
    it('updates permission in state', () => {
      const newPerms = { ...fPermission, publicKey: 'bla' };
      const result = slice.reducer({ permissions: [fPermission] }, updatePermission(newPerms));
      expect(result.permissions).toStrictEqual([newPerms]);
    });
  });

  describe('revokePermission()', () => {
    it('removes permission from state', () => {
      const result = slice.reducer({ permissions: [fPermission] }, revokePermission(fPermission));
      expect(result.permissions).toStrictEqual([]);
    });
  });

  describe('requestPermission()', () => {
    it('sets permission request in state', () => {
      const result = slice.reducer(
        { permissions: [], permissionRequest: undefined },
        requestPermission(fPermission)
      );
      expect(result.permissions).toStrictEqual([]);
      expect(result.permissionRequest).toBe(fPermission);
    });
  });

  describe('denyPermission()', () => {
    it('resets permission request', () => {
      const result = slice.reducer(
        { permissions: [], permissionRequest: fPermission },
        denyPermission(fPermission)
      );
      expect(result.permissionRequest).toBeUndefined();
    });
  });
});

import { ipcBridgeRenderer } from '@bridge';
import { DBRequestType } from '@types';

import { storage } from './storage';

jest.mock('@bridge', () => ({
  ipcBridgeRenderer: { db: { invoke: jest.fn() } }
}));

describe('storage', () => {
  it('getItem calls db getFromStore with accounts key', async () => {
    storage.getItem('accounts');
    expect(ipcBridgeRenderer.db.invoke).toHaveBeenCalledWith({
      type: DBRequestType.GET_FROM_STORE,
      key: 'accounts'
    });
  });

  it('setItem calls db setInStore with accounts key', async () => {
    storage.setItem('accounts', {});
    expect(ipcBridgeRenderer.db.invoke).toHaveBeenCalledWith({
      type: DBRequestType.SET_IN_STORE,
      key: 'accounts',
      payload: {}
    });
  });

  it('removeItem errors with invalid key', async () => {
    expect(() => storage.removeItem('bla')).toThrow();
  });
});

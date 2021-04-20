import { getFromStore, setInStore } from '@api/db';

import { storage } from './storage';

jest.mock('@api/db', () => ({
  getFromStore: jest.fn(),
  setInStore: jest.fn()
}));

describe('storage', () => {
  it('getItem calls db getFromStore with accounts key', async () => {
    storage.getItem('accounts');
    expect(getFromStore).toHaveBeenCalledWith('accounts');
  });

  it('setItem calls db setInStore with accounts key', async () => {
    storage.setItem('accounts', {});
    expect(setInStore).toHaveBeenCalledWith('accounts', {});
  });

  it('removeItem errors with invalid key', async () => {
    expect(() => storage.removeItem('bla')).toThrow();
  });
});

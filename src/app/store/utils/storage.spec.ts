import { getAccounts, setAccounts } from '@app/services';

import { storage } from './storage';

jest.mock('@app/services', () => ({
  getAccounts: jest.fn(),
  setAccounts: jest.fn()
}));

describe('storage', () => {
  it('getItem errors with invalid key', async () => {
    expect(() => storage.getItem('bla')).toThrow();
  });

  it('getItem calls getAccounts with accounts key', async () => {
    storage.getItem('accounts');
    expect(getAccounts).toHaveBeenCalledWith();
  });

  it('setItem errors with invalid key', async () => {
    expect(() => storage.setItem('bla', {})).toThrow();
  });

  it('setItem calls setAccounts with accounts key', async () => {
    storage.setItem('accounts', {});
    expect(setAccounts).toHaveBeenCalledWith({});
  });

  it('removeItem errors with invalid key', async () => {
    expect(() => storage.removeItem('bla')).toThrow();
  });
});

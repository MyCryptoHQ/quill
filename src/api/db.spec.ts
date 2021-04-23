import Store from 'electron-store';
import { promises as fs } from 'fs';

import { fAccount } from '@fixtures';

import {
  getFromStore,
  init,
  isLoggedIn,
  login,
  logout,
  reset,
  setInStore,
  storeExists
} from './db';

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  promises: {
    ...jest.requireActual('fs').promises,
    stat: jest.fn().mockImplementation(() => Promise.resolve()),
    unlink: jest.fn().mockImplementation(() => Promise.resolve())
  }
}));

jest.mock('path');
jest.mock('electron-store');

jest.mock('crypto', () => ({
  ...jest.requireActual('crypto'),
  randomBytes: jest.fn().mockImplementation(() => Buffer.from('2d21938ada7a165c39c8f3fd', 'hex'))
}));

jest.mock('electron', () => ({
  app: {
    getPath: jest.fn()
  }
}));

const password = 'password';
const encryptedAccounts =
  '233a864faa421c5d86984f909906c3d40a02b071ab03574b4c8f8aa6b5b1a158eae532b6db3609c12907c8f3db877f199470fb579f792a4ee85f59edcad9fe66d9ba4dd3a72d8af881f38c42d67b09ab9124490f9dd32608f46280b8e59e03db5f81495adbc4bd7a2c1b49bebb06e14623cff4d515cd557261135c4a175da3af1bf8f20a5e3f5efef74a74a1d8c96dd22220fac2361c174dbd1d5e25c91401c3fb89f002e88eb1a6549877d4de362c55baea7fab238861282281c57d53fd3a1a3f1d33155bc879e282d9fbb8eb0762988577322f2d21938ada7a165c39c8f3fd';

describe('isLoggedIn', () => {
  it('checks if the user is logged in', () => {
    expect(isLoggedIn()).toBe(false);
  });
});

describe('init', () => {
  it('initializes the store', async () => {
    await expect(init(password)).resolves.toBe(true);
  });

  it('fails with no input', async () => {
    await expect(init('')).resolves.toBe(false);
  });
});

describe('login', () => {
  const get = (Store as jest.MockedClass<typeof Store>).mock.instances[0].get;
  (get as jest.MockedFunction<typeof get>).mockReturnValue(encryptedAccounts);

  it('initializes the store', async () => {
    await expect(login(password)).resolves.toBe(true);
  });

  it('fails with wrong password', async () => {
    await expect(login('foobar')).resolves.toBe(false);
  });

  it('fails with an empty password', async () => {
    await expect(login('')).resolves.toBe(false);
  });
});

describe('logout', () => {
  it('clears the encryption key', async () => {
    await login(password);
    expect(isLoggedIn()).toBe(true);

    await logout();
    expect(isLoggedIn()).toBe(false);
  });
});

describe('reset', () => {
  it('resets the store', async () => {
    const store = (Store as jest.MockedClass<typeof Store>).mock.instances[0];

    await reset();

    expect(fs.unlink).toHaveBeenCalled();
    expect(store.clear).toHaveBeenCalled();
  });
});

describe('storeExists', () => {
  it('checks if the store exists', async () => {
    // @ts-expect-error Invalid return value
    (fs.stat as jest.MockedFunction<typeof fs.stat>).mockImplementationOnce(async () => true);
    await expect(storeExists()).resolves.toBe(true);

    // @ts-expect-error Invalid return value
    (fs.stat as jest.MockedFunction<typeof fs.stat>).mockImplementationOnce(async () => false);
    await expect(storeExists()).resolves.toBe(false);
  });
});

describe('getFromStore', () => {
  it('fetches from the store correctly', async () => {
    await init(password);

    const result = await getFromStore('accounts');
    expect(result).toStrictEqual({ accounts: { [fAccount.uuid]: fAccount } });
  });

  it('returns null if the key does not exist in the store', async () => {
    const get = (Store as jest.MockedClass<typeof Store>).mock.instances[0].get;
    (get as jest.MockedFunction<typeof get>).mockReturnValueOnce(null);

    await expect(getFromStore('foo bar')).toBeNull();
  });
});

describe('setInStore', () => {
  it('correctly sets value in store', async () => {
    const store = (Store as jest.MockedClass<typeof Store>).mock.instances[0];

    await init(password);
    await setInStore('accounts', { accounts: { [fAccount.uuid]: fAccount } });

    expect(store.set).toHaveBeenCalledWith(
      'accounts',
      '233a864faa421c5d86984f909906c3d40a02b071ab03574b4c8f8aa6b5b1a158eae532b6db3609c12907c8f3db877f199470fb579f793e5fe5491ea49bcfa621dafa4c88f365fade88a69712f17b01c49e003c5f80d57d2af638f2cfb6c852df5be723198896e83d7b5818b0a354b44c64c4e5c435e111666d1079165d7ab8cc2ae5b2581e434f97e04647d0b8ba02dd2118ead8255c5014fb134673840601d2f99e99668ced94cb72ea09f2b7252d4fafbf39f57bc2717c2fc2d57153f9645d781d33150a9f3cccd5a23153d36ed622e60edd6c2d21938ada7a165c39c8f3fd'
    );
  });

  it('does not set without an encryption key', async () => {
    const store = (Store as jest.MockedClass<typeof Store>).mock.instances[0];
    (store.set as jest.MockedFunction<typeof store.set>).mockClear();

    // Ensure there is no encryption key set
    await logout();
    await setInStore('accounts', { [fAccount.uuid]: fAccount });

    expect(store.set).not.toHaveBeenCalled();
  });
});

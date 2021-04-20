import { ipcMain } from 'electron';
import Store from 'electron-store';
import { promises as fs } from 'fs';
import keytar, { deletePassword } from 'keytar';

import { IPC_CHANNELS, KEYTAR_SERVICE } from '@config';
import { fAccount, fPrivateKey } from '@fixtures';
import type { TUuid } from '@types';
import { DBRequestType, WalletType } from '@types';

import type { handleRequest as _handleRequest, runService as _runService } from './db';
import { init, isLoggedIn, login, logout, reset, storeExists } from './db';

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
  },
  ipcMain: {
    handle: jest.fn().mockImplementation((_e, callback) => {
      callback();
    })
  }
}));

jest.mock('keytar', () => ({
  setPassword: jest.fn(),
  getPassword: jest
    .fn()
    .mockImplementation(
      () =>
        '6860de1fab1e5e03c3880b92874195800906ec77f007484c19878abdb9e3a65af3bb65b2d72a0e997d04cea288882a4fc072ee0bd76f2f19bb1d09ad88c3f671def50b2987872f229241677f5f3a8d93a0682d21938ada7a165c39c8f3fd'
    ),
  deletePassword: jest.fn(),
  findCredentials: jest.fn().mockReturnValue([{ account: 'foo' }])
}));

const uuid = '304a57a4-1752-53db-8861-67785534e98e' as TUuid;
const password = 'password';
const privateKey = '0x93b3701cf8eeb6f7d3b22211c691734f24816a02efa933f67f34d37053182577';
const encryptedPrivKey =
  '6860de1fab1e5e03c3880b92874195800906ec77f007484c19878abdb9e3a65af3bb65b2d72a0e997d04cea288882a4fc072ee0bd76f2f19bb1d09ad88c3f671def50b2987872f229241677f5f3a8d93a0682d21938ada7a165c39c8f3fd';
const encryptedAccounts =
  '233a864faa421c5d86984f909906c3d40a02b071ab03574b4c8f8aa6b5b1a158eae532b6db3609c12907c8f3db877f199470fb579f792a4ee85f59edcad9fe66d9ba4dd3a72d8af881f38c42d67b09ab9124490f9dd32608f46280b8e59e03db5f81495adbc4bd7a2c1b49bebb06e14623cff4d515cd557261135c4a175da3af1bf8f20a5e3f5efef74a74a1d8c96dd22220fac2361c174dbd1d5e25c91401c3fb89f002e88eb1a6549877d4de362c55baea7fab238861282281c57d53fd3a1a3f1d33155bc879e282d9fbb8eb0762988577322f2d21938ada7a165c39c8f3fd';

const { handleRequest, runService } = jest.requireActual<{
  handleRequest: typeof _handleRequest;
  runService: typeof _runService;
}>('./db');

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
    expect(deletePassword).toHaveBeenCalledWith(KEYTAR_SERVICE, 'foo');
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

describe('handleRequest', () => {
  it('get from store', async () => {
    await init(password);

    const result = await handleRequest({ type: DBRequestType.GET_FROM_STORE, key: 'accounts' });
    expect(result).toStrictEqual({ accounts: { [fAccount.uuid]: fAccount } });
  });

  it('get from store returns null if the key does not exist in the store', async () => {
    const get = (Store as jest.MockedClass<typeof Store>).mock.instances[0].get;
    (get as jest.MockedFunction<typeof get>).mockReturnValueOnce(null);

    await expect(
      handleRequest({ type: DBRequestType.GET_FROM_STORE, key: 'foo bar' })
    ).resolves.toBeNull();
  });

  it('set in store', async () => {
    const store = (Store as jest.MockedClass<typeof Store>).mock.instances[0];

    await init(password);
    await handleRequest({
      type: DBRequestType.SET_IN_STORE,
      key: 'accounts',
      payload: { accounts: { [fAccount.uuid]: fAccount } }
    });

    expect(store.set).toHaveBeenCalledWith(
      'accounts',
      '233a864faa421c5d86984f909906c3d40a02b071ab03574b4c8f8aa6b5b1a158eae532b6db3609c12907c8f3db877f199470fb579f793e5fe5491ea49bcfa621dafa4c88f365fade88a69712f17b01c49e003c5f80d57d2af638f2cfb6c852df5be723198896e83d7b5818b0a354b44c64c4e5c435e111666d1079165d7ab8cc2ae5b2581e434f97e04647d0b8ba02dd2118ead8255c5014fb134673840601d2f99e99668ced94cb72ea09f2b7252d4fafbf39f57bc2717c2fc2d57153f9645d781d33150a9f3cccd5a23153d36ed622e60edd6c2d21938ada7a165c39c8f3fd'
    );
  });

  it('set in store does not set without an encryption key', async () => {
    const store = (Store as jest.MockedClass<typeof Store>).mock.instances[0];
    (store.set as jest.MockedFunction<typeof store.set>).mockClear();

    // Ensure there is no encryption key set
    await logout();
    await handleRequest({
      type: DBRequestType.SET_IN_STORE,
      key: 'accounts',
      payload: { accounts: { [fAccount.uuid]: fAccount } }
    });

    expect(store.set).not.toHaveBeenCalled();
  });

  it('SAVE_ACCOUNT_SECRETS calls setPassword with encrypted privkey', async () => {
    await init(password);
    await handleRequest({
      type: DBRequestType.SAVE_ACCOUNT_SECRETS,
      wallet: {
        walletType: WalletType.PRIVATE_KEY,
        privateKey
      }
    });

    expect(keytar.setPassword).toHaveBeenCalledWith(KEYTAR_SERVICE, uuid, encryptedPrivKey);
  });

  it('GET_PRIVATE_KEY returns decrypted private key', async () => {
    await init(password);
    const response = await handleRequest({
      type: DBRequestType.GET_PRIVATE_KEY,
      uuid
    });

    expect(keytar.getPassword).toHaveBeenCalledWith(KEYTAR_SERVICE, uuid);
    expect(response).toBe(privateKey);
  });

  it('DELETE_ACCOUNT_SECRETS calls deletePassword', async () => {
    await handleRequest({
      type: DBRequestType.DELETE_ACCOUNT_SECRETS,
      uuid
    });

    expect(keytar.deletePassword).toHaveBeenCalledWith(KEYTAR_SERVICE, uuid);
  });

  it('errors if non supported type is passed', async () => {
    await expect(
      handleRequest({
        // @ts-expect-error Unsupported type
        type: 'bla',
        privateKey: fPrivateKey
      })
    ).rejects.toThrow();
  });
});

describe('runService', () => {
  it('calls ipcMain handle', () => {
    runService();
    expect(ipcMain.handle).toHaveBeenCalledWith(IPC_CHANNELS.DATABASE, expect.any(Function));
  });
});

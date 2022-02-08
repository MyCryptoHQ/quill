import Store from 'electron-store';
import { promises as fs } from 'fs';
import path from 'path';

import { clearStore, getFromStore, getStorePath, setInStore } from './store';

jest.mock('electron-store');
jest.useFakeTimers();

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  promises: {
    unlink: jest.fn().mockImplementation(() => Promise.resolve())
  }
}));

jest.mock('electron', () => ({
  app: {
    getPath: jest.fn().mockImplementation(() => 'foo')
  }
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('getStorePath', () => {
  it('returns the path to the store', () => {
    expect(getStorePath('accounts')).toBe(path.join('foo', 'accounts.json'));
  });
});

describe('clearStore', () => {
  it('clears the store', async () => {
    await clearStore(['accounts']);

    const store = (Store as jest.MockedClass<typeof Store>).mock.instances[0];

    expect(fs.unlink).toHaveBeenCalledWith(getStorePath('accounts'));
    expect(store.clear).toHaveBeenCalled();
  });
});

describe('getFromStore', () => {
  it('fetches from the store', async () => {
    await getFromStore('foo');

    const store = (Store as jest.MockedClass<typeof Store>).mock.instances[0];
    expect(store.get).toHaveBeenCalledWith('foo');
  });
});

describe('setInStore', () => {
  it('sets value in store', async () => {
    await setInStore('foo', 'bar');

    jest.runAllTimers();

    const store = (Store as jest.MockedClass<typeof Store>).mock.instances[0];
    expect(store.set).toHaveBeenCalledWith('foo', 'bar');
  });
});

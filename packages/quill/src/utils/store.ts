import { app } from 'electron';
import Store from 'electron-store';
import { promises as fs } from 'fs';
import path from 'path';

import { keyDebounce } from '@utils/debounce';

export const getStorePath = (key: string) => path.join(app.getPath('userData'), `${key}.json`);

export const clearStore = async (keys: string[]) => {
  for (const key of keys) {
    const store = new Store({ name: key });
    store.clear();

    await fs.unlink(getStorePath(key));
  }
};

export const getFromStore = (key: string): string | null => {
  const store = new Store<Record<string, string | null>>({ name: key });
  return store.get(key);
};

export const setInStore = keyDebounce((key: string, value: string) => {
  const store = new Store<Record<string, string>>({ name: key });
  store.set(key, value);
}, 1000);

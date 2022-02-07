import { app } from 'electron';
import Store from 'electron-store';
import { promises as fs } from 'fs';
import path from 'path';

export const getStorePath = () => path.join(app.getPath('userData'), 'config.json');

const store = new Store<Record<string, string | null>>();

export const clearStore = async () => {
  store.clear();

  await fs.unlink(getStorePath());
};

export const getFromStore = (key: string): string | null => {
  return store.get(key);
};

export const setInStore = (key: string, value: string) => {
  store.set(key, value);
};

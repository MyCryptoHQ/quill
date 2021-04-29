import { app } from 'electron';
import Store from 'electron-store';
import { promises as fs } from 'fs';
import path from 'path';

export const clearStore = async () => {
  const store = new Store();
  store.clear();

  await fs.unlink(getStorePath());
};

const getStorePath = () => path.join(app.getPath('userData'), 'config.json');

export const getFromStore = (key: string): string | null => {
  const store = new Store<Record<string, string | null>>();
  return store.get(key);
};

export const setInStore = (key: string, value: string) => {
  const store = new Store<Record<string, string>>();
  store.set(key, value);
};

import { getFromStore, setInStore } from '@api/db';

export const storage = {
  getItem: (key: string) => {
    return Promise.resolve(getFromStore(key));
  },
  setItem: (key: string, value: unknown) => {
    return Promise.resolve(setInStore(key, value));
  },
  removeItem: (_key: string) => {
    // @todo If needed
    throw new Error('Invalid key');
  }
};

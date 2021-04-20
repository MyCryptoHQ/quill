import { getFromStore, setInStore } from '@api/db';

export const storage = {
  getItem: async (key: string) => {
    return getFromStore(key);
  },
  setItem: async (key: string, value: unknown) => {
    return setInStore(key, value);
  },
  removeItem: (_key: string) => {
    // @todo If needed
    throw new Error('Invalid key');
  }
};

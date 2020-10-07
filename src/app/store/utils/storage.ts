import { getAccounts, setAccounts } from '@app/services';

export const storage = {
  getItem: (key: string) => {
    if (key === 'accounts') {
      return getAccounts();
    }
    throw new Error('Invalid key');
  },
  setItem: (key: string, value: any) => {
    if (key === 'accounts') {
      // @todo
      return setAccounts(value);
    }
    throw new Error('Invalid key');
  },
  removeItem: (key: string) => {
    if (key === 'accounts') {
      // @todo
      return;
    }
    throw new Error('Invalid key');
  }
};

import { getAccounts } from '@app/services';

export const storage = {
  getItem: (key: string) => {
    if (key === 'accounts') {
      return getAccounts();
    }
    throw new Error('Invalid key');
  },
  setItem: (key: string, _value: any) => {
    if (key === 'accounts') {
      // @todo
      return Promise.resolve();
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

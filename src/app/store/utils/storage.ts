import { getAccounts, setAccounts } from '@app/services';
import { IAccount } from '@types';

export const storage = {
  getItem: (key: string) => {
    if (key === 'accounts') {
      return getAccounts();
    }
    throw new Error('Invalid key');
  },
  setItem: (key: string, value: unknown) => {
    if (key === 'accounts') {
      return setAccounts(value as Record<string, IAccount>);
    }
    throw new Error('Invalid key');
  },
  removeItem: (_key: string) => {
    // @todo If needed
    throw new Error('Invalid key');
  }
};

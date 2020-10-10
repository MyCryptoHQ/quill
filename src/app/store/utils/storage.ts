import { getAccounts, setAccounts } from '@app/services';

import { AccountsState } from '../account';

export const storage = {
  getItem: (key: string) => {
    if (key === 'accounts') {
      return getAccounts();
    }
    throw new Error('Invalid key');
  },
  setItem: (key: string, value: unknown) => {
    if (key === 'accounts') {
      return setAccounts(value as AccountsState);
    }
    throw new Error('Invalid key');
  },
  removeItem: (_key: string) => {
    // @todo If needed
    throw new Error('Invalid key');
  }
};

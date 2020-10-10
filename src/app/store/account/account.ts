import { createAction } from '@reduxjs/toolkit';

import { IAccount } from '@types';

export interface AccountsState {
  accounts: Record<string, IAccount>;
}

export const INITIAL_STATE: AccountsState = { accounts: {} };

export const addAccount = createAction<IAccount>('account/addAccount');
export const removeAccount = createAction<IAccount>('account/removeAccount');

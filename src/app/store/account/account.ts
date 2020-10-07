import { createAction } from '@reduxjs/toolkit';

import { IAccount } from '@types';

export type AccountsState = IAccount[];

export const INITIAL_STATE: AccountsState = [];

export const setAccounts = createAction<IAccount[]>('account/setAccounts');

import { createAction } from '@reduxjs/toolkit';

import { IAccount } from '@types';

export type AccountsState = Record<string, IAccount>;

export const INITIAL_STATE: AccountsState = {};

export const addAccount = createAction<IAccount>('account/addAccount');
export const removeAccount = createAction<IAccount>('account/removeAccount');

import { createAction } from '@reduxjs/toolkit';

import type { JsonRPCResponse, Permission, TSignTransaction, UserRequest } from '@types';

const sliceName = 'ws';

export const requestSignTransaction = createAction<UserRequest<TSignTransaction>>(
  `${sliceName}/requestSignTransaction`
);
export const requestAccounts = createAction<UserRequest>(`${sliceName}/requestAccounts`);
export const requestPermissions = createAction<Permission>(`${sliceName}/requestPermissions`);

export const reply = createAction<JsonRPCResponse>(`${sliceName}/reply`);

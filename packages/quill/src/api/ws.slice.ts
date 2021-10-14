import type { JsonRPCResponse, TSignTransaction, UserRequest } from '@quill/common';
import { createAction } from '@reduxjs/toolkit';

const sliceName = 'ws';

export const requestSignTransaction = createAction<UserRequest<TSignTransaction>>(
  `${sliceName}/requestSignTransaction`
);

export const requestAccounts = createAction<UserRequest>(`${sliceName}/requestAccounts`);

export const reply = createAction<JsonRPCResponse>(`${sliceName}/reply`);

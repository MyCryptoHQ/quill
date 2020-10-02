import { createAction } from '@reduxjs/toolkit';

import { JsonRPCRequest } from '@types';

export type TXQueueState = JsonRPCRequest[];

export const INITIAL_STATE: TXQueueState = [];

export const enqueue = createAction<JsonRPCRequest>('txqueue/enqueue');
export const dequeue = createAction<void>('txqueue/dequeue');

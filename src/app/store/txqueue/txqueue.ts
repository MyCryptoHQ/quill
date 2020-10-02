import { createAction } from '@reduxjs/toolkit';

import { JsonRPCRequest } from '@types';

export interface TXQueueState {
  queue: JsonRPCRequest[];
}

export const INITIAL_STATE: TXQueueState = {
  queue: []
};

export const enqueue = createAction<JsonRPCRequest>('txqueue/enqueue');
export const dequeue = createAction<void>('txqueue/dequeue');

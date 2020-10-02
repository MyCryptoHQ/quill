import { createReducer } from '@reduxjs/toolkit';

import { dequeue, enqueue, INITIAL_STATE, TXQueueState } from './txqueue';

export const reducer = createReducer<TXQueueState>(INITIAL_STATE, (builder) =>
  builder
    .addCase(enqueue, (state, action) => {
      state = [...state, action.payload];
    })
    .addCase(dequeue, (state) => {
      const [, ...queue] = state;
      state = queue;
    })
);

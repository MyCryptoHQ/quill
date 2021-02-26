import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { JsonRPCRequest } from '@types';

import { ApplicationState } from './store';

export const initialState = { queue: [] as JsonRPCRequest[] };

const sliceName = 'transactions';

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    enqueue(state, action: PayloadAction<JsonRPCRequest>) {
      state.queue.push(action.payload);
    },
    dequeue(state) {
      state.queue.shift();
    }
  }
});

export const { enqueue, dequeue } = slice.actions;

export default slice;

export const getCurrentTransaction = createSelector(
  (state: ApplicationState) => state.transactions,
  (transactions) => transactions.queue[0]
);

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { JsonRPCRequest } from '@types';

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

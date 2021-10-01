import type { PayloadAction } from '@reduxjs/toolkit';
import { createSelector, createSlice } from '@reduxjs/toolkit';

import type { SliceState } from '../types';

interface WebSocketsSlice {
  nonces: {
    [publicKey: string]: number;
  };
}

const initialState: WebSocketsSlice = {
  nonces: {}
};

const sliceName = 'ws';

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    incrementNonce(state, action: PayloadAction<string>) {
      state.nonces[action.payload] = state.nonces[action.payload]
        ? state.nonces[action.payload] + 1
        : 1;
    }
  }
});

export const { incrementNonce } = slice.actions;

export default slice;

export const getNonce = (publicKey: string) =>
  createSelector(
    (state: SliceState<typeof slice>) => state.ws,
    (state) => state.nonces[publicKey] ?? 0
  );

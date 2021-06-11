import { createSelector, createSlice } from '@reduxjs/toolkit';

import type { SliceState } from '../types';

export type FlowState = number;
const initialState: FlowState = 0;

const sliceName = 'flow';

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    nextFlow(state) {
      return state + 1;
    },
    previousFlow(state) {
      return state - 1;
    },
    resetFlow() {
      return 0;
    }
  }
});

export const { nextFlow, previousFlow, resetFlow } = slice.actions;

export default slice;

export const getFlowStep = createSelector(
  (state: SliceState<typeof slice>) => state.flow,
  (step) => step
);

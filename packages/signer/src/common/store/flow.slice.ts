import { createSelector, createSlice } from '@reduxjs/toolkit';

import type { ApplicationState } from '@store';

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
  (state: ApplicationState) => state.flow,
  (step) => step
);

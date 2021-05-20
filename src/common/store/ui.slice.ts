import type { PayloadAction } from '@reduxjs/toolkit';
import { createSelector, createSlice } from '@reduxjs/toolkit';

import type { ApplicationState } from '@store';

interface UiState {
  navigationBack?: string;
}

const initialState: UiState = {};

const sliceName = 'ui';

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    setNavigationBack(state, action: PayloadAction<string | undefined>) {
      state.navigationBack = action.payload;
    }
  }
});

export const { setNavigationBack } = slice.actions;

export default slice;

export const getNavigationBack = createSelector(
  (state: ApplicationState) => state.ui,
  (state) => state.navigationBack
);

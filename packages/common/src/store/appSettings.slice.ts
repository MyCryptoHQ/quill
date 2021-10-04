import type { PayloadAction } from '@reduxjs/toolkit';
import { createAction, createSelector, createSlice } from '@reduxjs/toolkit';

import { AUTO_LOCK_TIMEOUT } from '../config';
import type { SliceState } from '../types';

export interface AppSettingsState {
  autoLockTimeout: number;
}

export const initialState: AppSettingsState = {
  autoLockTimeout: AUTO_LOCK_TIMEOUT
};

const sliceName = 'appSettings';

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    setAutoLockTimeout(state, action: PayloadAction<number>) {
      state.autoLockTimeout = action.payload;
    }
  }
});

export const { setAutoLockTimeout } = slice.actions;

export const quitApp = createAction(`${sliceName}/quit`);

export default slice;

export const reducer = slice.reducer;

export const getAutoLockTimeout = createSelector(
  (state: SliceState<typeof slice>) => state.appSettings,
  (settings) => settings.autoLockTimeout
);

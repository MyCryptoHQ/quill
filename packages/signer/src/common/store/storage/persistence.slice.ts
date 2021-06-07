import type { PayloadAction } from '@reduxjs/toolkit';
import { createAction, createSelector, createSlice } from '@reduxjs/toolkit';
import type { Optional } from 'utility-types';

import type { PersistState } from '@common/store';

interface PersistenceState {
  rehydratedKeys: string[];
}

const initialState: PersistenceState = {
  rehydratedKeys: []
};

const sliceName = 'persistence';

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    rehydrateState(state, action: PayloadAction<{ key: string; state: unknown }>) {
      state.rehydratedKeys.push(action.payload.key);
    },
    rehydrateEmptyState(state, action: PayloadAction<{ key: string }>) {
      state.rehydratedKeys.push(action.payload.key);
    }
  }
});

export const { rehydrateState, rehydrateEmptyState } = slice.actions;

export default slice;

export const rehydrateAllState = createAction<Record<string, unknown>>(
  `${sliceName}/rehydrateAllState`
);

export const getPersistenceState = createSelector(
  (state: { persistence: PersistenceState }) => state,
  (state) => state.persistence
);

export const getPersistentKeys = createSelector(
  (state: Record<string, Optional<PersistState>>) => state,
  (state) => Object.keys(state).filter((key) => !!state[key]._persistence)
);

export const getPersisted = createSelector(getPersistenceState, getPersistentKeys, (state, keys) =>
  keys.every((key) => state.rehydratedKeys.includes(key))
);

export const getWhitelistedActions = createSelector(
  (state: Record<string, PersistState>) => state,
  getPersistentKeys,
  (state, keys) => keys.flatMap((key) => state[key]._persistence.whitelistedActions)
);

export const getWhitelistedActionsByKey = (key: string) =>
  createSelector(
    (state: Record<string, PersistState>) => state[key],
    (state) => state._persistence.whitelistedActions
  );

export const getWhitelistedKeys = (key: string) =>
  createSelector(
    (state: Record<string, PersistState>) => state[key],
    (state) => state._persistence.whitelistedKeys
  );

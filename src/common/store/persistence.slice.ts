import type { PayloadAction } from '@reduxjs/toolkit';
import { createSelector, createSlice } from '@reduxjs/toolkit';
import type { Persistor } from 'redux-persist';

interface PersistenceState {
  // Is true if persistence is set up and synced with main process
  isPersisted: boolean;
  persistor?: Persistor;
}

const initialState: PersistenceState = {
  isPersisted: false
};

const sliceName = 'persistence';

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    setPersisted(state, action: PayloadAction<boolean>) {
      state.isPersisted = action.payload;
    },
    setPersistor(state, action: PayloadAction<Persistor>) {
      state.persistor = action.payload;
    }
  }
});

export const { setPersisted, setPersistor } = slice.actions;

export default slice;

export const getPersistenceState = createSelector(
  (state: { persistence: PersistenceState }) => state,
  (state) => state.persistence
);

export const getPersisted = createSelector(getPersistenceState, (state) => state.isPersisted);
export const getPersistor = createSelector(getPersistenceState, (state) => state.persistor);

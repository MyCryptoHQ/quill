import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const initialState = { newUser: true, loggedIn: false };

const sliceName = 'auth';

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    setNewUser(state, action: PayloadAction<boolean>) {
      state.newUser = action.payload;
    },
    setLoggedIn(state, action: PayloadAction<boolean>) {
      state.loggedIn = action.payload;
    }
  }
});

export const { setNewUser, setLoggedIn } = slice.actions;

export default slice;

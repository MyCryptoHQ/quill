import { createReducer } from '@reduxjs/toolkit';

import { AuthState, INITIAL_STATE, setLoggedIn, setNewUser } from './auth';

export const reducer = createReducer<AuthState>(INITIAL_STATE, (builder) =>
  builder
    .addCase(setLoggedIn, (state, action) => {
      return { ...state, loggedIn: action.payload };
    })
    .addCase(setNewUser, (state, action) => {
      return { ...state, newUser: action.payload };
    })
);

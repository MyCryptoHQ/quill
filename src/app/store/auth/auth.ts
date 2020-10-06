import { createAction } from '@reduxjs/toolkit';

export interface AuthState {
  newUser: boolean;
  loggedIn: boolean;
}

export const INITIAL_STATE: AuthState = { newUser: true, loggedIn: false };

export const setNewUser = createAction<boolean>('auth/setNewUser');
export const setLoggedIn = createAction<boolean>('auth/setLoggedIn');

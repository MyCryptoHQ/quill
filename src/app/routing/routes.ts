import { Route } from '@types';

import { Accounts, AddAccount, ForgotPassword, Home, Locked } from '../screens';
import { ROUTE_PATHS } from './routePaths';

export const ROUTES: Record<string, Route> = {
  LOCKED: { path: ROUTE_PATHS.LOCKED, component: Locked, exact: true, requireLogin: false },
  HOME: { path: ROUTE_PATHS.HOME, component: Home, exact: true, requireLogin: true },
  ADD_ACCOUNT: {
    path: ROUTE_PATHS.ADD_ACCOUNT,
    component: AddAccount,
    exact: true,
    requireLogin: true
  },
  ACCOUNTS: { path: ROUTE_PATHS.ACCOUNTS, component: Accounts, exact: true, requireLogin: true },
  FORGOT_PASSWORD: {
    path: ROUTE_PATHS.FORGOT_PASSWORD,
    component: ForgotPassword,
    exact: true,
    requireLogin: false
  }
};

import {
  Accounts,
  AddAccount,
  CreatePassword,
  EditTransaction,
  ForgotPassword,
  GenerateAccount,
  Home,
  Locked,
  Menu,
  RequestPermission,
  SetupAccount,
  SignTransaction,
  Transaction
} from '@screens';
import type { Route } from '@types';

import { ROUTE_PATHS } from './routePaths';

export const ROUTES: Record<string, Route> = {
  LOCKED: { path: ROUTE_PATHS.LOCKED, component: Locked, exact: true, requireLogin: false },
  CREATE_PASSWORD: {
    path: ROUTE_PATHS.CREATE_PASSWORD,
    component: CreatePassword,
    exact: true,
    requireLogin: false
  },
  HOME: { path: ROUTE_PATHS.HOME, component: Home, exact: true, requireLogin: true },
  TX: { path: ROUTE_PATHS.TX, component: Transaction, exact: true, requireLogin: true },
  EDIT_TX: {
    path: ROUTE_PATHS.EDIT_TX,
    component: EditTransaction,
    exact: true,
    requireLogin: true
  },
  SIGN_TX: {
    path: ROUTE_PATHS.SIGN_TX,
    component: SignTransaction,
    exact: true,
    requireLogin: true
  },
  SETUP_ACCOUNT: {
    path: ROUTE_PATHS.SETUP_ACCOUNT,
    component: SetupAccount,
    exact: true,
    requireLogin: true
  },
  ADD_ACCOUNT: {
    path: ROUTE_PATHS.ADD_ACCOUNT,
    component: AddAccount,
    exact: true,
    requireLogin: true
  },
  GENERATE_ACCOUNT: {
    path: ROUTE_PATHS.GENERATE_ACCOUNT,
    component: GenerateAccount,
    exact: true,
    requireLogin: true
  },
  ACCOUNTS: { path: ROUTE_PATHS.ACCOUNTS, component: Accounts, exact: true, requireLogin: true },
  FORGOT_PASSWORD: {
    path: ROUTE_PATHS.FORGOT_PASSWORD,
    component: ForgotPassword,
    exact: true,
    requireLogin: false
  },
  MENU: {
    path: ROUTE_PATHS.MENU,
    component: Menu,
    exact: true,
    requireLogin: true
  },
  REQUEST_PERMISSION: {
    path: ROUTE_PATHS.REQUEST_PERMISSION,
    component: RequestPermission,
    exact: true,
    requireLogin: true
  }
};

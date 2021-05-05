import { AddAccountSecurity } from '@screens/AddAccount';
import { AddAccountBackup } from '@screens/AddAccount/AddAccountBackup';
import type { Route } from '@types';

import {
  Accounts,
  AddAccount,
  AddAccountEnd,
  CreatePassword,
  ForgotPassword,
  GenerateAccount,
  Home,
  Locked,
  Menu,
  RequestPermission,
  SetupAccount,
  SignTransaction,
  Transaction
} from '../screens';
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
  ADD_ACCOUNT_SECURITY: {
    path: ROUTE_PATHS.ADD_ACCOUNT_SECURITY,
    component: AddAccountSecurity,
    exact: true,
    requireLogin: true
  },
  ADD_ACCOUNT_BACKUP: {
    path: ROUTE_PATHS.ADD_ACCOUNT_BACKUP,
    component: AddAccountBackup,
    exact: true,
    requireLogin: true
  },
  ADD_ACCOUNT_END: {
    path: ROUTE_PATHS.ADD_ACCOUNT_END,
    component: AddAccountEnd,
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

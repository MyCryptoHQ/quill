import { Route } from '@types';

import {
  Accounts,
  AddAccount,
  CreatePassword,
  CreateWallet,
  ForgotPassword,
  Home,
  Locked,
  Menu,
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
  },
  CREATE_WALLET: {
    path: ROUTE_PATHS.CREATE_WALLET,
    component: CreateWallet,
    exact: true,
    requireLogin: true
  },
  MENU: {
    path: ROUTE_PATHS.MENU,
    component: Menu,
    exact: true,
    requireLogin: true
  }
};

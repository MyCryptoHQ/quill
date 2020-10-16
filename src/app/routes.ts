import { Route } from '@types';

import { ROUTE_PATHS } from './routePaths';
import { Accounts, AddAccount, Home } from './screens';

export const ROUTES: Record<string, Route> = {
  HOME: { path: ROUTE_PATHS.HOME, component: Home, exact: true },
  ADD_ACCOUNT: { path: ROUTE_PATHS.ADD_ACCOUNT, component: AddAccount, exact: true },
  ACCOUNTS: { path: ROUTE_PATHS.ACCOUNTS, component: Accounts, exact: true }
};

import { Route } from '@types';

import { ROUTE_PATHS } from './routePaths';
import { AddAccount, Home } from './screens';

export const ROUTES: Record<string, Route> = {
  HOME: { path: ROUTE_PATHS.HOME, component: Home, exact: true },
  ADD_ACCOUNT: { path: ROUTE_PATHS.ADD_ACCOUNT, component: AddAccount, exact: true }
};

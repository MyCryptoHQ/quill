import { Route } from '@types';

import { AddAccount, Home } from './screens';

export const ROUTES: Record<string, Route> = {
  HOME: { path: '/', component: Home, exact: true },
  ADD_ACCOUNT: { path: '/add-account', component: AddAccount, exact: true }
};

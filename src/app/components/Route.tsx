import React from 'react';

import { Route as ActualRoute, Redirect, RouteProps } from 'react-router-dom';

import { ROUTE_PATHS } from '@app/routing';
import { useSelector } from '@app/store';

type Props = RouteProps & { requireLogin: boolean };

export const Route = ({ requireLogin, ...props }: Props) => {
  const loggedIn = useSelector((state) => state.auth.loggedIn);
  if (requireLogin && !loggedIn) {
    return <Redirect to={ROUTE_PATHS.LOCKED} />;
  }

  return <ActualRoute {...props} />;
};

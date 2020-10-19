import React from 'react';

import { Route as ActualRoute, Redirect, RouteProps } from 'react-router-dom';

import { useSelector } from '@app/store';

import { ROUTE_PATHS } from './routePaths';

type Props = RouteProps & { requireLogin: boolean };

export const Route = ({ component: Component, requireLogin, ...rest }: Props) => {
  const { loggedIn } = useSelector((state) => state.auth);
  return (
    <ActualRoute
      {...rest}
      render={(props) =>
        (requireLogin && loggedIn) || !requireLogin ? (
          <Component {...props} />
        ) : (
          <Redirect to={ROUTE_PATHS.LOCKED} />
        )
      }
    />
  );
};

import React from 'react';

import { Route as ActualRoute, Redirect, RouteProps } from 'react-router-dom';

import { ROUTE_PATHS } from '@app/routing';
import { useSelector } from '@app/store';

type Props = RouteProps & { requireLogin: boolean };

export const Route = ({ component: Component, requireLogin, ...rest }: Props) => {
  const loggedIn = useSelector((state) => state.auth.loggedIn);
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

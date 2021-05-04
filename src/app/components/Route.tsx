import type { RouteProps } from 'react-router-dom';
import { Route as ActualRoute, Redirect } from 'react-router-dom';

import { ROUTE_PATHS } from '@app/routing';
import { useSelector } from '@app/store';
import { getLoggedIn } from '@common/store';

type Props = RouteProps & { requireLogin: boolean };

export const Route = ({ component: Component, requireLogin, ...rest }: Props) => {
  const loggedIn = useSelector(getLoggedIn);
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

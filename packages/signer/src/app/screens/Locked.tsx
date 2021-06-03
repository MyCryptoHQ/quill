import { replace } from 'connected-react-router';
import { useEffect } from 'react';

import { ROUTE_PATHS } from '@app/routing';
import { useDispatch, useSelector } from '@app/store';
import { getLoggedIn, getNewUser } from '@common/store';

import { Login } from './Login';
import { NewUser } from './NewUser';

export const Locked = () => {
  const newUser = useSelector(getNewUser);
  const loggedIn = useSelector(getLoggedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    if (loggedIn) {
      dispatch(replace(ROUTE_PATHS.HOME));
    }
  }, [loggedIn]);

  if (newUser) {
    return <NewUser />;
  }

  return <Login />;
};

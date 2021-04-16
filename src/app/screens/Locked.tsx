import { useEffect } from 'react';

import { replace } from 'connected-react-router';

import { ROUTE_PATHS } from '@app/routing';
import { useDispatch, useSelector } from '@app/store';

import { Login } from './Login';
import { NewUser } from './NewUser';

export const Locked = () => {
  const newUser = useSelector((state) => state.auth.newUser);
  const loggedIn = useSelector((state) => state.auth.loggedIn);
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

import React, { useEffect } from 'react';

import { useHistory } from 'react-router-dom';

import { ROUTE_PATHS } from '@app/routing';
import { useSelector } from '@app/store';

import { Login } from './Login';
import { NewUser } from './NewUser';

export const Locked = () => {
  const newUser = useSelector((state) => state.auth.newUser);
  const loggedIn = useSelector((state) => state.auth.loggedIn);
  const history = useHistory();

  useEffect(() => {
    if (loggedIn) {
      history.replace(ROUTE_PATHS.HOME);
    }
  }, [loggedIn]);

  if (newUser) {
    return <NewUser />;
  }

  return <Login />;
};

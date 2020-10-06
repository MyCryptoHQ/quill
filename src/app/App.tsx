import React, { useEffect } from 'react';

import { Home, Login, NewUser } from './screens';
import { isLoggedIn, isNewUser } from './services';
import { useDispatch, useSelector } from './store';
import { setLoggedIn, setNewUser } from './store/auth';

export const App = () => {
  const { loggedIn, newUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    isNewUser().then((state) => {
      dispatch(setNewUser(state));
    });
    isLoggedIn().then((state) => {
      dispatch(setLoggedIn(state));
    });
  }, []);

  if (newUser) {
    return <NewUser />;
  }

  if (loggedIn) {
    return <Home />;
  }

  return <Login />;
};

import React, { useEffect } from 'react';

import { hot } from 'react-hot-loader';
import { Persistor } from 'redux-persist';

import { AppRoutes } from '@app/routing';

import { isLoggedIn, isNewUser } from './services';
import { useDispatch, useSelector } from './store';
import { setLoggedIn, setNewUser } from './store/auth';

const App = ({ persistor }: { persistor: Persistor }) => {
  const { loggedIn } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    isNewUser().then((state) => {
      dispatch(setNewUser(state));
    });
    isLoggedIn().then((state) => {
      dispatch(setLoggedIn(state));
    });
  }, []);

  useEffect(() => {
    if (loggedIn) {
      persistor.persist();
    }
  }, [loggedIn]);

  return <AppRoutes />;
};

export default hot(module)(App);

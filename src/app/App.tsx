import React, { useEffect } from 'react';

import { hot } from 'react-hot-loader';
import { Persistor } from 'redux-persist';

import { ipcBridgeRenderer } from '@bridge';
import { DBRequestType } from '@types';

import { AppRoutes } from './AppRoutes';
import { useDispatch, useSelector } from './store';
import { setLoggedIn, setNewUser } from './store/auth';

const App = ({ persistor }: { persistor: Persistor }) => {
  const loggedIn = useSelector((state) => state.auth.loggedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    ipcBridgeRenderer.db.invoke({ type: DBRequestType.IS_NEW_USER }).then((state) => {
      dispatch(setNewUser(state));
    });
    ipcBridgeRenderer.db.invoke({ type: DBRequestType.IS_LOGGED_IN }).then((state) => {
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

import React, { useEffect } from 'react';

import { hot } from 'react-hot-loader';
import { Box } from 'rebass';
import { Persistor } from 'redux-persist';

import { ipcBridgeRenderer } from '@bridge';
import { DBRequestType } from '@types';

import { AppRoutes } from './AppRoutes';
import { Navigation } from './components';
import { setLoggedIn, setNewUser, useDispatch, useSelector } from './store';

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

  return (
    <Box height="100vh">
      <Navigation isLoggedIn={loggedIn} />
      <Box height="100%" p="1" backgroundColor="#fbfbfb">
        <AppRoutes />
      </Box>
    </Box>
  );
};

export default hot(module)(App);

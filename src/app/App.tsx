import React, { useEffect } from 'react';

import { hot } from 'react-hot-loader';
import { Persistor } from 'redux-persist';

import { Box } from '@app/components';
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
    <Box height="100vh" overflow="hidden">
      <Navigation isLoggedIn={loggedIn} />
      <Box height="100%" p="1" mt="65px" backgroundColor="#fbfbfb" overflow="scroll">
        <AppRoutes />
      </Box>
    </Box>
  );
};

export default hot(module)(App);

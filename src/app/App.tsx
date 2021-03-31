import React, { useEffect } from 'react';

import { hot } from 'react-hot-loader';
import { ThemeProvider } from 'styled-components';

import { ipcBridgeRenderer } from '@bridge';
import { Box, Flex, Navigation } from '@components';
import { GlobalStyle, theme } from '@theme';
import { DBRequestType } from '@types';

import { AppRoutes } from './AppRoutes';
import { persistor, setNewUser, useDispatch, useSelector } from './store';

const App = () => {
  const loggedIn = useSelector((state) => state.auth.loggedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    ipcBridgeRenderer.db.invoke({ type: DBRequestType.IS_NEW_USER }).then((state) => {
      dispatch(setNewUser(state));
    });
  }, []);

  useEffect(() => {
    if (loggedIn) {
      persistor.persist();
    }
  }, [loggedIn]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Box height="100vh" overflow="hidden" sx={{ display: 'flex', flexDirection: 'column' }}>
        <Navigation isLoggedIn={loggedIn} />
        <Flex flexDirection="column" flex="1" overflowY="auto">
          <AppRoutes />
        </Flex>
      </Box>
    </ThemeProvider>
  );
};

export default hot(module)(App);

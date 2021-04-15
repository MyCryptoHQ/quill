import React, { useEffect } from 'react';

import { hot } from 'react-hot-loader';
import { ThemeProvider } from 'styled-components';

import { checkNewUser } from '@common/store';
import { Box, Flex, Navigation } from '@components';
import { GlobalStyle, theme } from '@theme';

import { AppRoutes } from './AppRoutes';
import { persistor, useDispatch, useSelector } from './store';

const App = () => {
  const loggedIn = useSelector((state) => state.auth.loggedIn);
  const isHandshaken = useSelector((state) => state.synchronization.isHandshaken);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isHandshaken) {
      dispatch(checkNewUser());
    }
  }, [isHandshaken]);

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

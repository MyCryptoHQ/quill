import { useEffect } from 'react';
import { hot } from 'react-hot-loader';
import { ThemeProvider } from 'styled-components';

import { checkNewUser, getHandshaken, SynchronizationTarget } from '@common/store';
import { Box, Flex, Navigation } from '@components';
import { GlobalStyle, theme } from '@theme';

import { AppRoutes } from './AppRoutes';
import { useDispatch, useSelector } from './store';

const App = () => {
  const loggedIn = useSelector((state) => state.auth.loggedIn);
  const isHandshaken = useSelector(getHandshaken(SynchronizationTarget.MAIN));
  const dispatch = useDispatch();

  useEffect(() => {
    if (isHandshaken) {
      dispatch(checkNewUser());
    }
  }, [isHandshaken]);

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

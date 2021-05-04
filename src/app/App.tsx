import '@fontsource/lato/300.css';
import '@fontsource/lato/400.css';
import '@fontsource/lato/700.css';
import '@fontsource/roboto-mono/400.css';

import { useEffect } from 'react';
import { hot } from 'react-hot-loader';
import { ThemeProvider } from 'styled-components';

import { checkNewUser, getHandshaken, getLoggedIn, getPersisted, Process } from '@common/store';
import { Box, Flex, Navigation } from '@components';
import { GlobalStyle, theme } from '@theme';

import { AppRoutes } from './AppRoutes';
import { Loading } from './screens';
import { useDispatch, useSelector } from './store';

const App = () => {
  const loggedIn = useSelector(getLoggedIn);
  const isHandshaken = useSelector(getHandshaken(Process.Main));
  const isPersisted = useSelector(getPersisted);
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
        <Navigation isLoggedIn={loggedIn && isPersisted} />
        <Flex flexDirection="column" flex="1" overflowY="auto">
          {(loggedIn && isPersisted) || !loggedIn ? <AppRoutes /> : <Loading />}
        </Flex>
      </Box>
    </ThemeProvider>
  );
};

export default hot(module)(App);

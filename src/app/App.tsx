import React, { useEffect } from 'react';

import { LoginState } from '@types';

import { Home, Login, NewUser } from './screens';
import { getLoginState } from './services';
import { useDispatch, useSelector } from './store';
import { setLoginState } from './store/auth';

export const App = () => {
  const { state: loginState } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    getLoginState().then((state) => {
      dispatch(setLoginState(state));
    });
  }, []);

  return (
    <>
      {loginState === LoginState.LOGGED_IN && <Home />}
      {loginState === LoginState.LOGGED_OUT && <Login />}
      {loginState === LoginState.NEW_USER && <NewUser />}
    </>
  );
};

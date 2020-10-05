/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import React, { useEffect } from 'react';

import ReactDOM from 'react-dom';
import { hot } from 'react-hot-loader';
import { Provider } from 'react-redux';

import { Home, Login, NewUser } from '@screens';
import { LoginState } from '@types';

import { getLoginState } from './services';
import { createStore, useDispatch, useSelector } from './store';
import { setLoginState } from './store/loggedin';

const store = createStore();

const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

const App = () => {
  const loginState = useSelector((state) => state.loggedIn);
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
const Hot = hot(module)(Root);

ReactDOM.render(<Hot />, document.getElementById('root'));

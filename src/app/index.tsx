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

import React from 'react';

import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'theme-ui';

import App from './App';
import { createPersistor, createStore } from './store';
import { theme } from './theme';

__webpack_nonce__ = window.__webpack_nonce__;

const store = createStore();

const Root = () => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <App persistor={createPersistor(store)} />
    </ThemeProvider>
  </Provider>
);

ReactDOM.render(<Root />, document.getElementById('root'));

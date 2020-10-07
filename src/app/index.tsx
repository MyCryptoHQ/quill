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
import { hot } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';

import { App } from './App';
import { createStore } from './store';

const store = createStore();
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const persistor = persistStore(store, { manualPersist: true });

const Root = () => (
  <Provider store={store}>
    <App persistor={persistor} />
  </Provider>
);

const Hot = hot(module)(Root);

ReactDOM.render(<Hot />, document.getElementById('root'));

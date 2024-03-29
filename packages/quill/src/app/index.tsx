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

import { ConnectedRouter } from 'connected-react-router';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { NonceProvider } from 'react-select';

import { history, store } from './store';

__webpack_nonce__ = window.__webpack_nonce__;

// Hack to make react-hot-loader work
const render = () => {
  /* eslint-disable-next-line  @typescript-eslint/no-var-requires */
  const App = require('./App').default;
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <NonceProvider nonce={__webpack_nonce__}>
          <App />
        </NonceProvider>
      </ConnectedRouter>
    </Provider>,
    document.getElementById('root')
  );
};

render();

if (module.hot) {
  module.hot.accept('./App', render);
}

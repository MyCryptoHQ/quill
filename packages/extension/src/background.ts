/**
 * Service worker / background script. Always runs in the background when the browser is open.
 */

import { handleBackgroundMessages } from './relay/handlers';
import { createPrivateKey, createStore } from './store';

const store = createStore();

// @todo Persist/load from local storage
store.dispatch(createPrivateKey());

handleBackgroundMessages(store);

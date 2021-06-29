/**
 * Page script that runs on every page, and is responsible for injecting `window.ethereum`.
 */

import { createProvider } from './relay/provider';

window.ethereum = createProvider();

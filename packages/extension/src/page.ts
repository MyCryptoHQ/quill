/**
 * Page script that runs on every page, and is responsible for injecting `window.ethereum`.
 */

import { injectProvider } from './relay/provider';

injectProvider();

/**
 * Content script that runs in a (somewhat isolated) page context. This injects a script into the actual page, and
 * relays any messages sent from it to the background script.
 */

import { handleContentMessages } from './relay/handlers';
import { injectScript } from './utils/inject';

// Injects the page script into every tab
injectScript().catch(console.error);
handleContentMessages();

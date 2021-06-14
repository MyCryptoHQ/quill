/**
 * Page script that runs on every page, and is responsible for injecting `window.ethereum`.
 */

// @todo: Create actual provider
window.ethereum = {
  isMyCrypto: true,
  request: () => {
    throw new Error('Not implemented');
  },
  on: () => {
    throw new Error('Not implemented');
  },
  once: () => {
    throw new Error('Not implemented');
  },
  emit: () => {
    throw new Error('Not implemented');
  }
};

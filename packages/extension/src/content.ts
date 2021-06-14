/**
 * Content script that runs in a (somewhat isolated) page context. This injects a script into the actual page, and
 * relays any messages sent from it to the background script.
 */

const injectScript = (): Promise<void> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('lib/page.js');
    script.addEventListener('load', () => {
      script.remove();
      resolve();
    });

    (document.head || document.documentElement).appendChild(script);
  });
};

injectScript();

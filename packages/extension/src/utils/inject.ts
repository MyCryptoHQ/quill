export const injectScript = (): Promise<void> => {
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

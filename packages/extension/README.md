# `@signer/extension`

MyCrypto Signer browser extension, which facilitates communication between the Signer application and webpages.

## Development

Currently the extension is only tested in Google Chrome. To use it, use the "Load unpacked" feature by following the
instructions [here](https://developer.chrome.com/docs/extensions/mv3/getstarted/#manifest). Make sure to select the
`packages/extension` folder.

You can use the `watch` script to automatically build any file changes. Note that changes are not automatically reloaded
in the browser.

```bash
$ yarn watch
```

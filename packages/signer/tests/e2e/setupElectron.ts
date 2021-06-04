import path from 'path';
import { Application } from 'spectron';

const windowsPath = path.join(__dirname, '../../out/signer-win32-x64/signer.exe');
// @todo verify
const macPath = path.join(__dirname, '../../out/signer-macosx-x64/signer');
const linuxPath = path.join(__dirname, '../../out/signer-linux-x64/signer');

const appPath = (() => {
  switch (process.platform) {
    case 'win32':
      return windowsPath;
    case 'darwin':
      return macPath;
    default:
      return linuxPath;
  }
})();

const app = new Application({
  path: appPath
});

export default app;

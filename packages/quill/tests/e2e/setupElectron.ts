import path from 'path';
import { Application } from 'spectron';

const windowsPath = path.join(__dirname, '../../out/quill-win32-x64/quill.exe');
// @todo verify
const macPath = path.join(__dirname, '../../out/quill-macosx-x64/quill');
const linuxPath = path.join(__dirname, '../../out/quill-linux-x64/quill');

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

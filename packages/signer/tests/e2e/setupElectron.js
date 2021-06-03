'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const path_1 = __importDefault(require('path'));
const spectron_1 = require('spectron');

const windowsPath = path_1.default.join(__dirname, '../out/signer-win32-x64/signer.exe');
// @todo verify
const macPath = path_1.default.join(__dirname, '../out/signer-macosx-x64/signer');
const linuxPath = path_1.default.join(__dirname, '../out/signer-linux-x64/signer');
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
const app = new spectron_1.Application({
  path: appPath
});
exports.default = app;
//# sourceMappingURL=setupElectron.js.map

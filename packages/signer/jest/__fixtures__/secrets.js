'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.fEncryptionPublicKey = exports.fEncryptionPrivateKey = exports.fKeystoreVectors = exports.fKeystorePassword = exports.fKeystore = exports.fPrivateKey = void 0;
const keystore_json_1 = __importDefault(require('./keystore.json'));

exports.fPrivateKey = '0x93b3701cf8eeb6f7d3b22211c691734f24816a02efa933f67f34d37053182577';
// Encrypted version of the private key above
exports.fKeystore = JSON.stringify(keystore_json_1.default.v3[0].json);
exports.fKeystorePassword = keystore_json_1.default.v3[0].password;
exports.fKeystoreVectors = keystore_json_1.default;
exports.fEncryptionPrivateKey =
  '0x89232f41ea0bc8099cd3a4abea50658c7012be675e605d0ca673bd1ec5305bfc';
exports.fEncryptionPublicKey =
  '0x0209ccf5b21b6ea99c59101fe71b5a2e6e824643a2c88761f0c4c9219401dd592f';
//# sourceMappingURL=secrets.js.map

'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.decrypt = exports.encrypt = exports.PrivateKey = void 0;
const _fixtures_1 = require('@fixtures');

class PrivateKey {
  constructor() {
    this.toHex = jest.fn().mockImplementation(() => _fixtures_1.fEncryptionPrivateKey);
    this.publicKey = {
      toHex: jest.fn().mockImplementation(() => _fixtures_1.fEncryptionPublicKey)
    };
  }
}
exports.PrivateKey = PrivateKey;
exports.encrypt = jest.requireActual('eciesjs').encrypt;
exports.decrypt = jest.requireActual('eciesjs').decrypt;
//# sourceMappingURL=eciesjs.js.map

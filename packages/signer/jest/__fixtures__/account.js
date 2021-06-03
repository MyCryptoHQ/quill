'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.fAccounts = exports.fAccount = void 0;
const wallets_1 = require('@mycrypto/wallets');

const _types_1 = require('@types');

exports.fAccount = {
  uuid: '4be38596-5d9c-5c01-8e04-19d1c726fe24',
  address: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520',
  type: _types_1.WalletType.PRIVATE_KEY,
  persistent: false
};
exports.fAccounts = [
  exports.fAccount,
  {
    uuid: '9b902e45-84be-5e97-b3a8-f937588397b4',
    address: '0x2a8aBa3dDD5760EE7BbF03d2294BD6134D0f555f',
    type: _types_1.WalletType.MNEMONIC,
    persistent: false,
    path: wallets_1.DEFAULT_ETH,
    index: 0
  },
  {
    uuid: '4175e739-2c60-5717-8e8a-a4f9974dcee2',
    address: '0xF0850b736BB0DE14AE95718569A5032C944e86C8',
    type: _types_1.WalletType.MNEMONIC,
    persistent: true,
    path: wallets_1.DEFAULT_ETH,
    index: 1
  },
  {
    uuid: '635a7d0a-4865-4f12-aafe-706b6ca6a99d',
    address: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520',
    type: _types_1.WalletType.KEYSTORE,
    persistent: false
  }
];
//# sourceMappingURL=account.js.map

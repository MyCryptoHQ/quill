'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.getTransactionRequest = exports.fSignedTx = exports.fRawTransaction = exports.fTxResponse = exports.fTxRequest = void 0;
const ethTxRequest_json_1 = __importDefault(require('./ethTxRequest.json'));
const ethTxResponse_json_1 = __importDefault(require('./ethTxResponse.json'));
const origin_1 = require('./origin');

exports.fTxRequest = ethTxRequest_json_1.default;
exports.fTxResponse = ethTxResponse_json_1.default;
exports.fRawTransaction =
  '0xeb0685012a05f20082520894b2bb2b958afa2e96dab3f3ce7162b87daea39017872386f26fc1000080038080';
exports.fSignedTx =
  '0xf86b0685012a05f20082520894b2bb2b958afa2e96dab3f3ce7162b87daea39017872386f26fc10000802aa0686df061021262b4e75eb1608c8baaf043cca2b5ac68fb24420ede62d13a8a7fa035389237414433ac06a33d95c863b8221fe2c797a9c650c47a555255be0234f3';
exports.getTransactionRequest = (from, tx) => ({
  origin: origin_1.fRequestOrigin,
  request: {
    ...exports.fTxRequest,
    params: [
      {
        ...exports.fTxRequest.params[0],
        ...tx,
        from
      }
    ]
  }
});
//# sourceMappingURL=transaction.js.map

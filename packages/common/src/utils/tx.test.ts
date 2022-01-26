import { BigNumber } from '@ethersproject/bignumber';
import { parse } from '@ethersproject/transactions';

import { isHistoryTx, makeQueueTx } from '.';
import { fAccounts, fRawTransaction, fRequestOrigin, fSignedTx, fTxRequest } from '../__fixtures__';
import { JsonRPCMethod, TxResult } from '../types';
import { isRawTransaction, makeHistoryTx, makeTx, toTransactionRequest } from './tx';

describe('makeTx', () => {
  it('extracts tx from json rpc request', () => {
    const { gas, ...rest } = fTxRequest.params[0];

    expect(makeTx(fTxRequest)).toStrictEqual({ gasLimit: gas, ...rest });
  });
});

describe('toTransactionRequest', () => {
  it('returns tx request', () => {
    expect(
      toTransactionRequest({
        ...parse(fRawTransaction),
        from: fAccounts[1].address
      })
    ).toStrictEqual({
      request: {
        jsonrpc: '2.0',
        id: 0,
        method: JsonRPCMethod.SignTransaction,
        params: [
          {
            chainId: 3,
            data: '0x',
            from: '0x2a8aBa3dDD5760EE7BbF03d2294BD6134D0f555f',
            gas: '0x5208',
            gasPrice: '0x012a05f200',
            nonce: '0x6',
            to: '0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017',
            value: '0x2386f26fc10000'
          }
        ]
      }
    });
  });

  it('handles EIP1559 gas params', () => {
    const { gasPrice, ...parsedTx } = parse(fRawTransaction);
    expect(
      toTransactionRequest({
        ...parsedTx,
        maxFeePerGas: BigNumber.from('0x012a05f200'),
        maxPriorityFeePerGas: BigNumber.from('0x3b9aca00'),
        from: fAccounts[1].address,
        type: 2
      })
    ).toStrictEqual({
      request: {
        jsonrpc: '2.0',
        id: 0,
        method: JsonRPCMethod.SignTransaction,
        params: [
          {
            chainId: 3,
            data: '0x',
            from: '0x2a8aBa3dDD5760EE7BbF03d2294BD6134D0f555f',
            gas: '0x5208',
            maxFeePerGas: '0x012a05f200',
            maxPriorityFeePerGas: '0x3b9aca00',
            nonce: '0x6',
            to: '0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017',
            value: '0x2386f26fc10000',
            type: 2
          }
        ]
      }
    });
  });
});

describe('isRawTransaction', () => {
  it('returns true on valid raw tx', () => {
    expect(isRawTransaction(fRawTransaction)).toBe(true);
  });

  it('returns false on valid raw tx', () => {
    expect(isRawTransaction('0x00')).toBe(false);
    expect(isRawTransaction(fSignedTx)).toBe(false);
  });
});

describe('isHistoryTx', () => {
  const request = { origin: fRequestOrigin, request: fTxRequest };
  it('returns true on history txs', () => {
    expect(isHistoryTx(makeHistoryTx(makeQueueTx(request), TxResult.APPROVED))).toBe(true);
    expect(isHistoryTx(makeHistoryTx(makeQueueTx(request), TxResult.DENIED))).toBe(true);
  });

  it('returns false on queue tx', () => {
    expect(isHistoryTx(makeQueueTx(request))).toBe(false);
  });
});

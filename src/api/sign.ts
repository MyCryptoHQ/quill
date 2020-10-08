import { TransactionRequest } from '@ethersproject/abstract-provider';
import { Wallet } from '@ethersproject/wallet';
import { ipcMain } from 'electron';

import { ipcBridgeMain } from '@bridge';
import { CryptoRequest, CryptoRequestType, CryptoResponse } from '@types';
import { addHexPrefix } from '@utils';

// @todo Keystore

export const sign = (wallet: Wallet, tx: TransactionRequest) => {
  return wallet.signTransaction(tx);
};

export const signWithMnemonic = (mnemonicPhrase: string, dPath: string, tx: TransactionRequest) => {
  return sign(Wallet.fromMnemonic(mnemonicPhrase, dPath), tx);
};

export const signWithPrivateKey = (privateKey: string, tx: TransactionRequest) => {
  return sign(new Wallet(addHexPrefix(privateKey)), tx);
};

export const handleRequest = async (request: CryptoRequest): Promise<CryptoResponse> => {
  switch (request.type) {
    case CryptoRequestType.SIGN: {
      const { privateKey, tx } = request;
      return signWithPrivateKey(privateKey, tx);
    }
    default:
      throw new Error('Undefined request type');
  }
};

export const runService = () => {
  ipcBridgeMain(ipcMain).crypto.handle((_e, request) => handleRequest(request));
};

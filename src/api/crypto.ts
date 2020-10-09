import { TransactionRequest } from '@ethersproject/abstract-provider';
import { Wallet } from '@ethersproject/wallet';
import { ipcMain } from 'electron';

import { ipcBridgeMain } from '@bridge';
import { CryptoRequest, CryptoRequestType, CryptoResponse, TAddress } from '@types';
import { addHexPrefix, generateDeterministicAddressUUID } from '@utils';

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

export const getAddress = (privateKey: string) => {
  const address = new Wallet(addHexPrefix(privateKey)).address as TAddress;
  return { address, uuid: generateDeterministicAddressUUID(address) };
};

export const handleRequest = async (request: CryptoRequest): Promise<CryptoResponse> => {
  switch (request.type) {
    case CryptoRequestType.SIGN: {
      const { privateKey, tx } = request;
      return signWithPrivateKey(privateKey, tx);
    }
    case CryptoRequestType.GET_ADDRESS: {
      const { privateKey } = request;
      return getAddress(privateKey);
    }
    default:
      throw new Error('Undefined request type');
  }
};

export const runService = () => {
  ipcBridgeMain(ipcMain).crypto.handle((_e, request) => handleRequest(request));
};

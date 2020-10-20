import { TransactionRequest } from '@ethersproject/abstract-provider';
import { entropyToMnemonic } from '@ethersproject/hdnode';
import { randomBytes } from '@ethersproject/random';
import { Wallet } from '@ethersproject/wallet';
import { ipcMain } from 'electron';

import { ipcBridgeMain } from '@bridge';
import { MNEMONIC_ENTROPY_BYTES } from '@config';
import { AccountType, CryptoRequest, CryptoRequestType, CryptoResponse, TAddress } from '@types';
import { addHexPrefix, generateDeterministicAddressUUID } from '@utils';

const sign = (wallet: Wallet, tx: TransactionRequest) => {
  return wallet.signTransaction(tx);
};

const signWithPrivateKey = (privateKey: string, tx: TransactionRequest) => {
  return sign(new Wallet(addHexPrefix(privateKey)), tx);
};

const getAddress = (privateKey: string) => {
  const address = new Wallet(addHexPrefix(privateKey)).address as TAddress;
  return { address, uuid: generateDeterministicAddressUUID(address) };
};

const createMnemonicWallet = () => {
  const entropy = randomBytes(MNEMONIC_ENTROPY_BYTES);
  return entropyToMnemonic(entropy);
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
    case CryptoRequestType.CREATE_WALLET: {
      const { wallet } = request;
      if (wallet === AccountType.MNEMONIC) {
        return createMnemonicWallet();
      }
      throw new Error('Unsupported wallet type');
    }
    default:
      throw new Error('Undefined request type');
  }
};

export const runService = () => {
  ipcBridgeMain(ipcMain).crypto.handle((_e, request) => handleRequest(request));
};

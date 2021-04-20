import type { TransactionRequest } from '@ethersproject/abstract-provider';
import type { DerivationPath } from '@mycrypto/wallets';
import { MnemonicPhrase, PrivateKey } from '@mycrypto/wallets';
import { getDeterministicWallet, getWallet } from '@wallets/wallet-initialisation';
import type { WebContents } from 'electron';
import { ipcMain } from 'electron';

import { getPrivateKey } from '@api/db';
import { ipcBridgeMain } from '@bridge';
import type {
  CryptoRequest,
  CryptoResponse,
  SerializedDeterministicWallet,
  SerializedOptionalPersistentWallet,
  SerializedWallet,
  TUuid
} from '@types';
import { CryptoRequestType, WalletType } from '@types';

const getPersistentWallet = async (uuid: TUuid): Promise<PrivateKey> => {
  const privateKey = await getPrivateKey(uuid);
  return new PrivateKey(privateKey);
};

export const signTransaction = async (
  wallet: SerializedOptionalPersistentWallet,
  tx: TransactionRequest
) => {
  const initialisedWallet = wallet.persistent
    ? await getPersistentWallet(wallet.uuid)
    : await getWallet(wallet as SerializedWallet);
  return initialisedWallet.signTransaction(tx);
};

export const getAddress = async (wallet: SerializedWallet) => {
  const initialisedWallet = await getWallet(wallet);
  return initialisedWallet.getAddress();
};

export const createWallet = async (wallet: WalletType) => {
  if (wallet === WalletType.MNEMONIC) {
    return MnemonicPhrase.create().mnemonicPhrase;
  }
  throw new Error('Unsupported wallet type');
};

export const getAddresses = async (
  wallet: SerializedDeterministicWallet,
  path: DerivationPath,
  limit: number,
  offset: number
) => {
  const initialisedWallet = await getDeterministicWallet(wallet);
  return initialisedWallet.getAddresses({ path, limit, offset });
};

export const handleRequest = async (request: CryptoRequest): Promise<CryptoResponse> => {
  switch (request.type) {
    case CryptoRequestType.SIGN: {
      const { wallet, tx } = request;
      return signTransaction(wallet, tx);
    }
    case CryptoRequestType.GET_ADDRESS: {
      const { wallet } = request;
      return getAddress(wallet);
    }
    case CryptoRequestType.CREATE_WALLET: {
      const { wallet } = request;
      return createWallet(wallet);
    }
    case CryptoRequestType.GET_ADDRESSES: {
      const { wallet, limit, offset, path } = request;
      return getAddresses(wallet, path, limit, offset);
    }
    default:
      throw new Error('Undefined request type');
  }
};

export const runService = (webContents: WebContents) => {
  ipcBridgeMain(ipcMain, webContents).crypto.handle((_e, request) => handleRequest(request));
};

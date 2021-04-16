import { MnemonicPhrase, PrivateKey } from '@mycrypto/wallets';
import { getDeterministicWallet, getWallet } from '@wallets/wallet-initialisation';
import type { WebContents } from 'electron';
import { ipcMain } from 'electron';

import { getPrivateKey } from '@api/db';
import { ipcBridgeMain } from '@bridge';
import type { CryptoRequest, CryptoResponse, SerializedWallet, TUuid } from '@types';
import { CryptoRequestType, WalletType } from '@types';

const getPersistentWallet = async (uuid: TUuid): Promise<PrivateKey> => {
  const privateKey = await getPrivateKey(uuid);
  return new PrivateKey(privateKey);
};

export const handleRequest = async (request: CryptoRequest): Promise<CryptoResponse> => {
  switch (request.type) {
    case CryptoRequestType.SIGN: {
      const { wallet, tx } = request;
      const initialisedWallet = wallet.persistent
        ? await getPersistentWallet(wallet.uuid)
        : await getWallet(wallet as SerializedWallet);
      return initialisedWallet.signTransaction(tx);
    }
    case CryptoRequestType.GET_ADDRESS: {
      const { wallet } = request;
      const initialisedWallet = await getWallet(wallet);
      return initialisedWallet.getAddress();
    }
    case CryptoRequestType.CREATE_WALLET: {
      const { wallet } = request;
      if (wallet === WalletType.MNEMONIC) {
        return MnemonicPhrase.create().mnemonicPhrase;
      }
      throw new Error('Unsupported wallet type');
    }
    case CryptoRequestType.GET_ADDRESSES: {
      const { wallet, limit, offset, path } = request;
      const initialisedWallet = await getDeterministicWallet(wallet);
      return initialisedWallet.getAddresses({ path, limit, offset });
    }
    default:
      throw new Error('Undefined request type');
  }
};

export const runService = (webContents: WebContents) => {
  ipcBridgeMain(ipcMain, webContents).crypto.handle((_e, request) => handleRequest(request));
};

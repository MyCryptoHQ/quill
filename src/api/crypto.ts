import { MnemonicPhrase } from '@wallets/implementations/deterministic/mnemonic-phrase';
import { getDeterministicWallet, getWallet } from '@wallets/wallet-initialisation';
import { ipcMain } from 'electron';

import { ipcBridgeMain } from '@bridge';
import { CryptoRequest, CryptoRequestType, CryptoResponse, WalletType } from '@types';

export const handleRequest = async (request: CryptoRequest): Promise<CryptoResponse> => {
  switch (request.type) {
    case CryptoRequestType.SIGN: {
      const { wallet, tx } = request;
      const initialisedWallet = await getWallet(wallet);
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

export const runService = () => {
  ipcBridgeMain(ipcMain).crypto.handle((_e, request) => handleRequest(request));
};

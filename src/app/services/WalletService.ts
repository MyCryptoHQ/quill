import { TransactionRequest, TransactionResponse } from '@ethersproject/abstract-provider';

import { ipcBridgeRenderer } from '@bridge';
import {
  CryptoRequestType,
  GetMnemonicAddressesResult,
  GetMnemonicAddressRequest,
  GetPrivateKeyAddressRequest,
  GetPrivateKeyAddressResult,
  WalletType
} from '@types';

export const signWithPrivateKey = (
  privateKey: string,
  tx: TransactionRequest
): Promise<TransactionResponse> => {
  return ipcBridgeRenderer.crypto.invoke({ type: CryptoRequestType.SIGN, privateKey, tx });
};

export const getAddress = (
  request: GetPrivateKeyAddressRequest | GetMnemonicAddressRequest
): Promise<
  GetPrivateKeyAddressResult | GetMnemonicAddressesResult | GetMnemonicAddressesResult[]
> => {
  return ipcBridgeRenderer.crypto.invoke({ type: CryptoRequestType.GET_ADDRESS, ...request });
};

export const createMnemonic = (): Promise<string> => {
  return ipcBridgeRenderer.crypto.invoke({
    type: CryptoRequestType.CREATE_WALLET,
    wallet: WalletType.MNEMONIC
  });
};

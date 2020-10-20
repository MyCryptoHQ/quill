import { TransactionRequest, TransactionResponse } from '@ethersproject/abstract-provider';

import { ipcBridgeRenderer } from '@bridge';
import { AccountType, CryptoRequestType, TAddress, TUuid } from '@types';

export const signWithPrivateKey = (
  privateKey: string,
  tx: TransactionRequest
): Promise<TransactionResponse> => {
  return ipcBridgeRenderer.crypto.invoke({ type: CryptoRequestType.SIGN, privateKey, tx });
};

export const getAddressFromPrivateKey = (
  privateKey: string
): Promise<{ uuid: TUuid; address: TAddress }> => {
  return ipcBridgeRenderer.crypto.invoke({ type: CryptoRequestType.GET_ADDRESS, privateKey });
};

export const createMnemonic = (): Promise<string> => {
  return ipcBridgeRenderer.crypto.invoke({
    type: CryptoRequestType.CREATE_WALLET,
    wallet: AccountType.MNEMONIC
  });
};

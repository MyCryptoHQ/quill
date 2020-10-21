import { TransactionRequest, TransactionResponse } from '@ethersproject/abstract-provider';

import { ipcBridgeRenderer } from '@bridge';
import {
  CryptoRequestType,
  GetAddressRequest,
  GetMnemonicAddressesResult,
  TAddress,
  TUuid,
  WalletType
} from '@types';

export const signWithPrivateKey = (
  privateKey: string,
  tx: TransactionRequest
): Promise<TransactionResponse> => {
  return ipcBridgeRenderer.crypto.invoke({ type: CryptoRequestType.SIGN, privateKey, tx });
};

export const getAddress = ({
  wallet,
  args
}: Omit<GetAddressRequest, 'type'>): Promise<
  { uuid: TUuid; address: TAddress } | GetMnemonicAddressesResult
> => {
  return ipcBridgeRenderer.crypto.invoke({ type: CryptoRequestType.GET_ADDRESS, wallet, args });
};

export const createMnemonic = (): Promise<string> => {
  return ipcBridgeRenderer.crypto.invoke({
    type: CryptoRequestType.CREATE_WALLET,
    wallet: WalletType.MNEMONIC
  });
};

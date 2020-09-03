import { Wallet } from 'ethers';
import { TransactionRequest } from '@ethersproject/abstract-provider';
import { addHexPrefix } from './util';

// @todo Keystore

export const signWithMnemonic = async (
  mnemonicPhrase: string,
  dPath: string,
  tx: TransactionRequest
) => {
  return sign(Wallet.fromMnemonic(mnemonicPhrase, dPath), tx);
};

export const signWithPrivateKey = async (
  privateKey: string,
  tx: TransactionRequest
) => {
  return sign(new Wallet(addHexPrefix(privateKey)), tx);
};

export const sign = async (wallet: Wallet, tx: TransactionRequest) => {
  return await wallet.signTransaction(tx);
};

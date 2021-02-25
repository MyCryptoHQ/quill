import { TransactionRequest } from '@ethersproject/abstract-provider';
import { Wallet as EthersWallet } from '@ethersproject/wallet';
import { Wallet } from '@wallets/wallet';

import { addHexPrefix } from '@utils';

export class PrivateKey implements Wallet {
  constructor(private readonly privateKey: string) {
  }

  signTransaction(transaction: TransactionRequest): Promise<string> {
    const wallet = new EthersWallet(addHexPrefix(this.privateKey));
    return wallet.signTransaction(transaction);
  }
}

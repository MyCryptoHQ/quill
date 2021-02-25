import { HDNode } from '@ethersproject/hdnode';
import { DeterministicWallet } from '@wallets/deterministic-wallet';
import { PrivateKey } from '@wallets/implementations/non-deterministic/private-key';
import { Wallet } from '@wallets/wallet';

import { TAddress } from '@types';

export class MnemonicPhrase extends DeterministicWallet {
  constructor(private readonly mnemonicPhrase: string, private readonly passphrase?: string) {
    super();
  }

  async getAddress(_: string): Promise<TAddress> {
    return '0x0' as TAddress;
  }

  async getWallet(path: string): Promise<Wallet> {
    const rootNode = HDNode.fromMnemonic(this.mnemonicPhrase, this.passphrase);
    const node = rootNode.derivePath(path);
    return new PrivateKey(node.privateKey);
  }
}

import { entropyToMnemonic, HDNode } from '@ethersproject/hdnode';
import { DeterministicWallet } from '@wallets/deterministic-wallet';
import { PrivateKey } from '@wallets/implementations/non-deterministic/private-key';
import { Wallet } from '@wallets/wallet';
import crypto from 'crypto';

import { MNEMONIC_ENTROPY_BYTES } from '@config';
import { TAddress } from '@types';

export class MnemonicPhrase extends DeterministicWallet {
  constructor(public readonly mnemonicPhrase: string, public readonly passphrase?: string) {
    super();
  }

  async getAddress(path: string): Promise<TAddress> {
    const rootNode = HDNode.fromMnemonic(this.mnemonicPhrase, this.passphrase);
    const node = rootNode.derivePath(path);
    return node.address as TAddress;
  }

  async getWallet(path: string): Promise<Wallet> {
    const rootNode = HDNode.fromMnemonic(this.mnemonicPhrase, this.passphrase);
    const node = rootNode.derivePath(path);
    return new PrivateKey(node.privateKey);
  }

  static create(passphrase?: string) {
    const entropy = crypto.randomBytes(MNEMONIC_ENTROPY_BYTES);
    const mnemonicPhrase = entropyToMnemonic(entropy);

    return new MnemonicPhrase(mnemonicPhrase, passphrase);
  }

  protected async getHDNode(path: string): Promise<HDNode> {
    const hdNode = HDNode.fromMnemonic(this.mnemonicPhrase, this.passphrase);
    return hdNode.derivePath(path);
  }
}

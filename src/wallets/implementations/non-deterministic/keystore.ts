import { decryptJsonWalletSync } from '@ethersproject/json-wallets';

import { PrivateKey } from './private-key';

export class Keystore extends PrivateKey {
  constructor(readonly keystore: string, readonly password: string) {
    super(Keystore.decryptKeystoreFile(keystore, password));
  }

  private static decryptKeystoreFile(keystore: string, password: string): string {
    const { privateKey } = decryptJsonWalletSync(keystore, password);
    return privateKey;
  }
}

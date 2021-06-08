import type { DerivationPath } from '@mycrypto/wallets';

import type { TAddress } from './address';
import type { TUuid } from './uuid';
import type { WalletType } from './wallet-type';

export interface IAccountBase {
  uuid: TUuid;
  label?: string;
  address: TAddress;
  persistent: boolean;
}

export type IAccountNonDeterministic = IAccountBase & {
  type: WalletType.PRIVATE_KEY | WalletType.KEYSTORE;
};

export type IAccountDeterministic = IAccountBase & {
  type: WalletType.MNEMONIC;
  path?: DerivationPath;
  index?: number;
};

export type IAccount = IAccountNonDeterministic | IAccountDeterministic;

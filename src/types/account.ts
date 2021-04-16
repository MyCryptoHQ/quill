import type { DerivationPath } from '@mycrypto/wallets';

import type { TAddress } from './address';
import type { TUuid } from './uuid';
import type { WalletType } from './wallet';

export interface IAccount {
  uuid: TUuid;
  type: WalletType;
  label?: string;
  address: TAddress;
  persistent: boolean;
  dPath?: DerivationPath;
  index?: number;
}

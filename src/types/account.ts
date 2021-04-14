import { DerivationPath } from '@mycrypto/wallets';

import { TAddress } from './address';
import { TUuid } from './uuid';
import { WalletType } from './wallet';

export interface IAccount {
  uuid: TUuid;
  type: WalletType;
  label?: string;
  address: TAddress;
  persistent: boolean;
  dPath?: DerivationPath;
  index?: number;
}

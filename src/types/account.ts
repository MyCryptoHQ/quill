import { TAddress } from './address';
import { TUuid } from './uuid';
import { WalletType } from './wallet';

export interface IAccount {
  uuid: TUuid;
  type: WalletType;
  address: TAddress;
  persistent: boolean;
}

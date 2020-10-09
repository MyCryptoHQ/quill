import { TAddress } from './address';
import { TUuid } from './uuid';

export enum AccountType {
  PRIVATE_KEY = 'PRIVATE_KEY',
  KEYSTORE = 'KEYSTORE',
  MNEMONIC = 'MNEMONIC'
}

export interface IAccount {
  uuid: TUuid;
  type: AccountType;
  address: TAddress;
  persistent: boolean;
}

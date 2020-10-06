import { TAddress } from './address';

enum AccountType {
  PRIVATE_KEY = 'PRIVATE_KEY',
  KEYSTORE = 'KEYSTORE',
  MNEMONIC = 'MNEMONIC'
}

export interface IAccount {
  type: AccountType;
  address: TAddress;
  persistent: boolean;
}

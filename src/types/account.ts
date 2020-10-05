import { TAddress } from './address';

enum AccountType {
  PRIVATE_KEY,
  KEYSTORE,
  MNEMONIC
}

export interface IAccount {
  type: AccountType;
  address: TAddress;
  persistent: boolean;
}

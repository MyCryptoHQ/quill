import { IAccount, TAddress, TUuid, WalletType } from '@types';

export const fAccount: IAccount = {
  uuid: '4be38596-5d9c-5c01-8e04-19d1c726fe24' as TUuid,
  address: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520' as TAddress,
  type: WalletType.PRIVATE_KEY,
  persistent: false
};

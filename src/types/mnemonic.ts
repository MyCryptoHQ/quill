import { TAddress } from './address';
import { TUuid } from './uuid';

export interface GetMnemonicAddressArgs {
  dPath: string;
  phrase: string;
  password?: string;
}

export interface GetMnemonicAddressesArgs {
  dPathBase: string;
  phrase: string;
  password?: string;
  offset?: number;
  limit: number;
}

export interface GetMnemonicAddressesResult {
  dPath: string;
  uuid: TUuid;
  address: TAddress;
  privateKey: string;
}

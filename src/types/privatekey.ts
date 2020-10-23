import { TAddress } from './address';
import { TUuid } from './uuid';

export interface GetPrivateKeyAddressResult {
  uuid: TUuid;
  address: TAddress;
}

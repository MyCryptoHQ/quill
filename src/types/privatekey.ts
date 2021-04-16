import type { TAddress } from './address';
import type { TUuid } from './uuid';

export interface GetPrivateKeyAddressResult {
  uuid: TUuid;
  address: TAddress;
}

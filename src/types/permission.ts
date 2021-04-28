import type { TUuid } from '@types';

export interface Permission {
  uuid: TUuid;
  origin: string;
  publicKey: string;
}

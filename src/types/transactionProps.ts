import type { TransactionRequest } from '@ethersproject/abstract-provider';

import type { SerializedWallet } from '@types';

import type { IAccount } from './account';

export interface SignTransactionProps {
  onAccept(wallet: SerializedWallet): void;
  onError?(error: string): void;
  currentAccount?: IAccount;
  tx: TransactionRequest;
}

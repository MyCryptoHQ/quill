import type { TransactionRequest } from '@ethersproject/abstract-provider';

import type { SerializedWallet } from '@types';

import type { IAccount } from './account';

export interface SignTransactionProps {
  onAccept(wallet: SerializedWallet): void;
  currentAccount?: IAccount;
  tx: TransactionRequest;
  setError?(error: string): void;
}

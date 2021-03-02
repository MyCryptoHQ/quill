import { TransactionRequest } from '@ethersproject/abstract-provider';

import { SerializedWallet } from '@types';

import { IAccount } from './account';

export interface SignTransactionProps {
  onAccept(wallet: SerializedWallet): void;
  onDeny(): void;
  currentAccount?: IAccount;
  tx: TransactionRequest;
  setError?(error: string): void;
}

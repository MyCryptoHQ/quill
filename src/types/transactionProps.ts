import { TransactionRequest } from '@ethersproject/abstract-provider';

import { IAccount } from './account';

export interface SignTransactionProps {
  onAccept(privKey: string): void;
  onDeny(): void;
  hasPersistentPrivateKey: boolean;
  currentAccount?: IAccount;
  tx: TransactionRequest;
}

import { TransactionRequest } from '@ethersproject/abstract-provider';

import { IAccount } from './account';

export interface SignTransactionProps {
  //onAccept(privKey: string): void;
  onDeny(): void;
  currentAccount?: IAccount;
  tx: TransactionRequest;
  setError?(error: string): void;
}

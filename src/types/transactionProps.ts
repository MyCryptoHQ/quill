import type { TransactionRequest } from '@ethersproject/abstract-provider';

import type { IAccountNonDeterministic, SerializedWallet } from '@types';

import type { IAccount } from './account';

export interface SignTransactionProps<AccountType extends IAccount = IAccountNonDeterministic> {
  onAccept(wallet: SerializedWallet): void;
  onError?(error: string): void;
  currentAccount?: AccountType;
  tx: TransactionRequest;
}

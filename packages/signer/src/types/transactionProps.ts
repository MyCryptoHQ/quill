import type { TransactionRequest } from '@ethersproject/abstract-provider';
import type { IAccount, IAccountNonDeterministic, SerializedWallet } from '@signer/common';

export interface SignTransactionProps<AccountType extends IAccount = IAccountNonDeterministic> {
  onAccept(wallet: SerializedWallet): void;
  onError?(error: string): void;
  currentAccount?: AccountType;
  tx: TransactionRequest;
}

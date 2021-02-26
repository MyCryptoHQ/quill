import React, { useState } from 'react';

import { useAccounts } from '@app/hooks';
import { useApiService } from '@app/services';
import { WalletType } from '@types';
import { makeTx } from '@utils';

import { SignTransactionMnemonic } from './SignTransactionMnemonic';
import { SignTransactionPrivateKey } from './SignTransactionPrivateKey';

export const SignTransaction = () => {
  const { denyCurrent, currentTx } = useApiService();
  const { accounts } = useAccounts();
  const formattedTx = currentTx && makeTx(currentTx);
  const currentAccount = formattedTx && accounts.find((a) => a.address === formattedTx.from);
  const hasPersistentPrivateKey = currentAccount && currentAccount.persistent;
  const [error, setError] = useState('');

  const handleDeny = async () => {
    if (currentTx) {
      denyCurrent();
      setError('');
    }
  };


  return (
    <>
      {currentTx ? <pre>{JSON.stringify(currentTx, null, 2)}</pre> : 'Nothing to sign'}
      <br />
      {currentAccount && currentAccount.type === WalletType.PRIVATE_KEY && (
        <SignTransactionPrivateKey
          hasPersistentPrivateKey={hasPersistentPrivateKey}
          onDeny={handleDeny}
          tx={formattedTx}
          currentAccount={currentAccount}
        />
      )}
      {currentAccount && currentAccount.type === WalletType.MNEMONIC && (
        <SignTransactionMnemonic
          hasPersistentPrivateKey={hasPersistentPrivateKey}
          onDeny={handleDeny}
          tx={formattedTx}
          currentAccount={currentAccount}
          setError={setError}
        />
      )}
      <br />
      {error}
    </>
  );
};

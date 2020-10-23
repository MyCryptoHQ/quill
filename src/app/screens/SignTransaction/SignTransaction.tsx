import React, { useState } from 'react';

import { useAccounts } from '@app/hooks';
import { getPrivateKey, signWithPrivateKey, useApiService } from '@app/services';
import { WalletType } from '@types';
import { makeTx } from '@utils';

import { SignTransactionMnemonic } from './SignTransactionMnemonic';
import { SignTransactionPrivateKey } from './SignTransactionPrivateKey';

export const SignTransaction = () => {
  const { approveCurrent, denyCurrent, currentTx } = useApiService();
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

  const handleAccept = async (privKey: string) => {
    const privateKey = hasPersistentPrivateKey ? await getPrivateKey(currentAccount.uuid) : privKey;
    if (privateKey.length > 0 && currentTx) {
      try {
        const signed = await signWithPrivateKey(privateKey, formattedTx);
        approveCurrent(signed);
        setError('');
      } catch (err) {
        setError(err.message);
      }
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
          onAccept={handleAccept}
          tx={formattedTx}
          currentAccount={currentAccount}
        />
      )}
      {currentAccount && currentAccount.type === WalletType.MNEMONIC && (
        <SignTransactionMnemonic
          hasPersistentPrivateKey={hasPersistentPrivateKey}
          onDeny={handleDeny}
          onAccept={handleAccept}
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

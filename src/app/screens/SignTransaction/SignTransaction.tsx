import React, { useState } from 'react';

import { useSelector } from 'react-redux';

import {
  denyCurrentTransaction,
  getAccounts,
  getCurrentTransaction,
  useDispatch
} from '@app/store';
import { WalletType } from '@types';
import { makeTx } from '@utils';

import { SignTransactionMnemonic } from './SignTransactionMnemonic';
import { SignTransactionPrivateKey } from './SignTransactionPrivateKey';

export const SignTransaction = () => {
  const dispatch = useDispatch();
  const accounts = useSelector(getAccounts);
  const currentTransaction = useSelector(getCurrentTransaction);
  const formattedTx = currentTransaction && makeTx(currentTransaction);
  const currentAccount = formattedTx && accounts.find((a) => a.address === formattedTx.from);
  const hasPersistentPrivateKey = currentAccount && currentAccount.persistent;
  const [error, setError] = useState('');

  const handleDeny = async () => {
    if (currentTransaction) {
      dispatch(denyCurrentTransaction());
      setError('');
    }
  };

  return (
    <>
      {currentTransaction ? (
        <pre>{JSON.stringify(currentTransaction, null, 2)}</pre>
      ) : (
        'Nothing to sign'
      )}
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

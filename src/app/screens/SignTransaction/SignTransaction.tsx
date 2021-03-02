import React, { useState } from 'react';

import { useSelector } from 'react-redux';

import {
  denyCurrentTransaction,
  getAccounts,
  getCurrentTransaction,
  sign,
  useDispatch
} from '@app/store';
import { SerializedWallet, WalletType } from '@types';
import { makeTx } from '@utils';

import { SignTransactionMnemonic } from './SignTransactionMnemonic';
import { SignTransactionPrivateKey } from './SignTransactionPrivateKey';

export const SignTransaction = () => {
  const dispatch = useDispatch();
  const accounts = useSelector(getAccounts);
  const currentTransaction = useSelector(getCurrentTransaction);
  const formattedTx = currentTransaction && makeTx(currentTransaction);
  const currentAccount = formattedTx && accounts.find((a) => a.address === formattedTx.from);
  const [error, setError] = useState('');

  const handleAccept = async (wallet: SerializedWallet) => {
    return dispatch(
      sign({
        wallet: currentAccount.persistent
          ? {
              persistent: true,
              uuid: currentAccount.uuid
            }
          : wallet,
        tx: formattedTx
      })
    );
  };

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
          onAccept={handleAccept}
          onDeny={handleDeny}
          tx={formattedTx}
          currentAccount={currentAccount}
        />
      )}
      {currentAccount && currentAccount.type === WalletType.MNEMONIC && (
        <SignTransactionMnemonic
          onAccept={handleAccept}
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

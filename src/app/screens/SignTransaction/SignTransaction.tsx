import React, { useState } from 'react';

import { useSelector } from 'react-redux';

import {
  denyCurrentTransaction,
  getAccounts,
  getCurrentTransaction,
  sign,
  useDispatch
} from '@app/store';
import { SignTransactionKeystore } from '@screens/SignTransaction/SignTransactionKeystore';
import { SerializedWallet, TxResult, WalletType } from '@types';

import { SignTransactionMnemonic } from './SignTransactionMnemonic';
import { SignTransactionPrivateKey } from './SignTransactionPrivateKey';

export const SignTransaction = () => {
  const dispatch = useDispatch();
  const accounts = useSelector(getAccounts);
  const { tx, result } = useSelector(getCurrentTransaction);
  const currentAccount = tx && accounts.find((a) => a.address === tx.from);
  const [error, setError] = useState('');
  const isWaiting = result === TxResult.WAITING;

  const handleAccept = async (wallet: SerializedWallet) => {
    return dispatch(
      sign({
        wallet: currentAccount.persistent
          ? {
              persistent: true,
              uuid: currentAccount.uuid
            }
          : wallet,
        tx
      })
    );
  };

  const handleDeny = async () => {
    if (tx) {
      dispatch(denyCurrentTransaction());
      setError('');
    }
  };

  return (
    <>
      {tx && <pre>{JSON.stringify(tx, null, 2)}</pre>}
      <br />
      {isWaiting && currentAccount && currentAccount.type === WalletType.PRIVATE_KEY && (
        <SignTransactionPrivateKey
          onAccept={handleAccept}
          onDeny={handleDeny}
          tx={tx}
          currentAccount={currentAccount}
        />
      )}
      {isWaiting && currentAccount && currentAccount.type === WalletType.MNEMONIC && (
        <SignTransactionMnemonic
          onAccept={handleAccept}
          onDeny={handleDeny}
          tx={tx}
          currentAccount={currentAccount}
          setError={setError}
        />
      )}
      {isWaiting && currentAccount && currentAccount.type === WalletType.KEYSTORE && (
        <SignTransactionKeystore
          onAccept={handleAccept}
          onDeny={handleDeny}
          tx={tx}
          currentAccount={currentAccount}
        />
      )}
      <br />
      {error}
    </>
  );
};

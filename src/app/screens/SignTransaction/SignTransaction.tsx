import { useState } from 'react';

import { useSelector } from 'react-redux';

import { getAccounts, getCurrentTransaction, sign, useDispatch } from '@app/store';
import { SerializedWallet, TxResult, WalletType } from '@types';

import { SignTransactionKeystore } from './SignTransactionKeystore';
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
        wallet,
        tx
      })
    );
  };

  const components = {
    [WalletType.PRIVATE_KEY]: SignTransactionPrivateKey,
    [WalletType.MNEMONIC]: SignTransactionMnemonic,
    [WalletType.KEYSTORE]: SignTransactionKeystore
  };

  const SignComponent = currentAccount && components[currentAccount.type];

  return (
    <>
      {isWaiting && currentAccount && (
        <SignComponent
          onAccept={handleAccept}
          tx={tx}
          currentAccount={currentAccount}
          setError={setError}
        />
      )}
      {error}
    </>
  );
};

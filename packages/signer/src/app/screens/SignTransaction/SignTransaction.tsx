import { getAccounts, getCurrentTransaction, sign, TxResult, WalletType } from '@signer/common';
import type { IAccount, SerializedWallet } from '@signer/common';
import { push } from 'connected-react-router';
import type { ComponentType } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import { useDispatch } from '@app/store';
import { ROUTE_PATHS } from '@routing';
import type { SignTransactionProps } from '@types';

import { SignTransactionKeystore } from './SignTransactionKeystore';
import { SignTransactionMnemonic } from './SignTransactionMnemonic';
import { SignTransactionPrivateKey } from './SignTransactionPrivateKey';

export const SignTransaction = () => {
  const dispatch = useDispatch();
  const accounts = useSelector(getAccounts);
  const { tx, result } = useSelector(getCurrentTransaction);
  const [error, setError] = useState('');

  const currentAccount = tx && accounts.find((a) => a.address === tx.from);
  const isWaiting = result === TxResult.WAITING;

  const handleAccept = async (wallet: SerializedWallet) => {
    return dispatch(
      sign({
        wallet,
        tx
      })
    );
  };

  if (!isWaiting || !currentAccount) {
    dispatch(push(ROUTE_PATHS.HOME));
    return null;
  }

  if (currentAccount) {
    const components = {
      [WalletType.PRIVATE_KEY]: SignTransactionPrivateKey,
      [WalletType.KEYSTORE]: SignTransactionKeystore,
      [WalletType.MNEMONIC]: SignTransactionMnemonic
    };

    const SignComponent =
      currentAccount &&
      (components[currentAccount.type] as ComponentType<SignTransactionProps<IAccount>>);
    return (
      <>
        <SignComponent
          onAccept={handleAccept}
          tx={tx}
          currentAccount={currentAccount}
          onError={setError}
        />
        {error}
      </>
    );
  }
};

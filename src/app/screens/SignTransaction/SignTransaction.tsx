import { push } from 'connected-react-router';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import { useDispatch } from '@app/store';
import { getAccounts, getCurrentTransaction, sign } from '@common/store';
import { ROUTE_PATHS } from '@routing';
import type { SerializedWallet } from '@types';
import { TxResult, WalletType } from '@types';

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
      [WalletType.MNEMONIC]: SignTransactionMnemonic,
      [WalletType.KEYSTORE]: SignTransactionKeystore
    };

    const SignComponent = currentAccount && components[currentAccount.type];
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

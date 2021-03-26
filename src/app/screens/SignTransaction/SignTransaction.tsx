import React, { useState } from 'react';

import { useSelector } from 'react-redux';

import { Blockie, Body, Box } from '@app/components';
import {
  denyCurrentTransaction,
  getAccounts,
  getCurrentTransaction,
  sign,
  useDispatch
} from '@app/store';
import { SignTransactionKeystore } from '@screens/SignTransaction/SignTransactionKeystore';
import { translateRaw } from '@translations';
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
        wallet,
        tx
      })
    );
  };

  const handleDeny = async () => {
    dispatch(denyCurrentTransaction());
  };

  const components = {
    [WalletType.PRIVATE_KEY]: SignTransactionPrivateKey,
    [WalletType.MNEMONIC]: SignTransactionMnemonic,
    [WalletType.KEYSTORE]: SignTransactionKeystore
  };

  const SignComponent = currentAccount && components[currentAccount.type];

  return (
    <>
      <Box variant="rowAlign" mb="2">
        <Blockie height="32px" width="32px" address={currentAccount.address} mr="2" />
        <Box>
          <Body>{translateRaw('NO_LABEL')}</Body>
          <Body fontSize="14px">{currentAccount.address}</Body>
        </Box>
      </Box>
      {isWaiting && currentAccount && (
        <SignComponent
          onAccept={handleAccept}
          onDeny={handleDeny}
          tx={tx}
          currentAccount={currentAccount}
          setError={setError}
        />
      )}
      <br />
      {error}
    </>
  );
};

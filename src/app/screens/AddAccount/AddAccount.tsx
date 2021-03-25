import React, { useEffect, useState } from 'react';

import { WalletTypeSelector } from '@app/components';
import { fetchReset, useDispatch } from '@app/store';
import { AddAccountKeystore } from '@screens/AddAccount/AddAccountKeystore';
import { WalletType } from '@types';

import { AddAccountMnemonic } from './AddAccountMnemonic';
import { AddAccountPrivateKey } from './AddAccountPrivateKey';

export const AddAccount = () => {
  const [walletType, setWalletType] = useState(WalletType.PRIVATE_KEY);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchReset());
  }, [walletType]);

  return (
    <>
      <WalletTypeSelector walletType={walletType} setWalletType={setWalletType} />
      {walletType === WalletType.PRIVATE_KEY && <AddAccountPrivateKey />}
      {walletType === WalletType.MNEMONIC && <AddAccountMnemonic />}
      {walletType === WalletType.KEYSTORE && <AddAccountKeystore />}
    </>
  );
};

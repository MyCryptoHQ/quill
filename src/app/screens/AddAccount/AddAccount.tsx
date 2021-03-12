import React, { useState } from 'react';

import { WalletTypeSelector } from '@app/components';
import { AddAccountKeystore } from '@screens/AddAccount/AddAccountKeystore';
import { WalletType } from '@types';

import { AddAccountMnemonic } from './AddAccountMnemonic';
import { AddAccountPrivateKey } from './AddAccountPrivateKey';

export const AddAccount = () => {
  const [walletType, setWalletType] = useState(WalletType.PRIVATE_KEY);

  return (
    <>
      <WalletTypeSelector walletType={walletType} setWalletType={setWalletType} />
      <br />
      {walletType === WalletType.PRIVATE_KEY && <AddAccountPrivateKey />}
      {walletType === WalletType.MNEMONIC && <AddAccountMnemonic />}
      {walletType === WalletType.KEYSTORE && <AddAccountKeystore />}
    </>
  );
};

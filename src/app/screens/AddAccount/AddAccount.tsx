import React, { useState } from 'react';

import { AddAccountKeystore } from '@screens/AddAccount/AddAccountKeystore';
import { WalletType } from '@types';

import { AddAccountMnemonic } from './AddAccountMnemonic';
import { AddAccountPrivateKey } from './AddAccountPrivateKey';

export const AddAccount = () => {
  const [walletType, setWalletType] = useState(WalletType.PRIVATE_KEY);

  const changeWalletType = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setWalletType(e.currentTarget.value as WalletType);

  return (
    <>
      <label>
        Type
        <br />
        <select onChange={changeWalletType}>
          {Object.values(WalletType).map((wallet, index) => (
            <option key={index} value={wallet}>
              {wallet}
            </option>
          ))}
        </select>
      </label>
      <br />
      {walletType === WalletType.PRIVATE_KEY && <AddAccountPrivateKey />}
      {walletType === WalletType.MNEMONIC && <AddAccountMnemonic />}
      {walletType === WalletType.KEYSTORE && <AddAccountKeystore />}
    </>
  );
};

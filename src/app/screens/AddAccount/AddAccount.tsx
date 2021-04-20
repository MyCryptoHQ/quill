import { useEffect, useState } from 'react';

import { useDispatch } from '@app/store';
import { fetchReset } from '@common/store';
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
      {walletType === WalletType.PRIVATE_KEY && (
        <AddAccountPrivateKey setWalletType={setWalletType} />
      )}
      {walletType === WalletType.MNEMONIC && <AddAccountMnemonic setWalletType={setWalletType} />}
      {walletType === WalletType.KEYSTORE && <AddAccountKeystore setWalletType={setWalletType} />}
    </>
  );
};

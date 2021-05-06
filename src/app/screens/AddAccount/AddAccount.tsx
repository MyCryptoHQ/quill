import { useEffect, useState } from 'react';

import { useDispatch } from '@app/store';
import { fetchReset } from '@common/store';
import { setAccountsToAdd } from '@common/store/accounts.slice';
import { useUnmount } from '@hooks';
import { AddAccountKeystore } from '@screens/AddAccount/AddAccountKeystore';
import { WalletType } from '@types';

import { AddAccountMnemonic } from './AddAccountMnemonic';
import { AddAccountPrivateKey } from './AddAccountPrivateKey';

interface Props {
  walletType?: WalletType;
}

export const AddAccount = ({ walletType: defaultWalletType = WalletType.PRIVATE_KEY }: Props) => {
  const [walletType, setWalletType] = useState(defaultWalletType);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchReset());
  }, [walletType]);

  useUnmount(() => {
    dispatch(fetchReset());
    dispatch(setAccountsToAdd([]));
  });

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

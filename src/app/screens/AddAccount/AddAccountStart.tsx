import type { PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';

import { useDispatch } from '@app/store';
import { fetchReset } from '@common/store';
import type { IFlowComponentProps } from '@components';
import { WalletType } from '@types';

import { AddAccountKeystore, AddAccountMnemonic, AddAccountPrivateKey } from './wallets';

interface Props {
  walletType?: WalletType;
}

const components = {
  [WalletType.PRIVATE_KEY]: AddAccountPrivateKey,
  [WalletType.MNEMONIC]: AddAccountMnemonic,
  [WalletType.KEYSTORE]: AddAccountKeystore
};

export const AddAccountStart = ({
  flowHeader,
  walletType: defaultWalletType = WalletType.PRIVATE_KEY
}: PropsWithChildren<Props & IFlowComponentProps>) => {
  const [walletType, setWalletType] = useState(defaultWalletType);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchReset());
  }, [walletType]);

  const Component = components[walletType];
  return <Component setWalletType={setWalletType} flowHeader={flowHeader} />;
};

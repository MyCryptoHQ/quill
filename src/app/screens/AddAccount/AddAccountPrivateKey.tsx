import { Button } from '@mycrypto/ui';
import React, { useEffect } from 'react';

import { useDispatch, useSelector } from '@app/store';
import { fetchAccounts, getAccountError } from '@common/store';
import { translateRaw } from '@common/translate';
import { PanelBottom, ScrollableContainer, WalletTypeSelector } from '@components';
import { WalletType } from '@types';

import { PrivateKeyForm, usePrivateKeyForm } from '../forms/PrivateKeyForm';

interface Props {
  setWalletType(walletType: WalletType): void;
}

export const AddAccountPrivateKey = ({ setWalletType }: Props) => {
  const form = usePrivateKeyForm();

  return <AddAccountPrivateKeyForm form={form} setWalletType={setWalletType} />;
};

const AddAccountPrivateKeyForm = ({
  form,
  setWalletType
}: { form: ReturnType<typeof usePrivateKeyForm> } & Props) => {
  const dispatch = useDispatch();
  const error: string = useSelector(getAccountError);

  useEffect(() => {
    if (form.errorMap['privateKey'] !== error) {
      form.setError('privateKey', error);
    }
  }, [error]);

  const handleSubmit = () => {
    dispatch(
      fetchAccounts([
        {
          walletType: WalletType.PRIVATE_KEY,
          privateKey: form.values.privateKey
        }
      ])
    );
  };

  return (
    <>
      <ScrollableContainer>
        <WalletTypeSelector walletType={WalletType.PRIVATE_KEY} setWalletType={setWalletType} />
        <PrivateKeyForm form={form} onSubmit={handleSubmit} />
      </ScrollableContainer>
      <PanelBottom>
        <Button type="submit" form="private-key-form">
          {translateRaw('VERIFY_ACCOUNT')}
        </Button>
      </PanelBottom>
    </>
  );
};

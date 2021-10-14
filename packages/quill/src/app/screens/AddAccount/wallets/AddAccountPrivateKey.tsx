import { Button } from '@mycrypto/ui';
import { fetchAccounts, getAccountError, translateRaw, WalletType } from '@quill/common';
import type { ReactElement } from 'react';
import React, { useEffect } from 'react';

import { useDispatch, useSelector } from '@app/store';
import { PanelBottom, ScrollableContainer, WalletTypeSelector } from '@components';

import { PrivateKeyForm, usePrivateKeyForm } from '../../forms/PrivateKeyForm';

interface Props {
  flowHeader: ReactElement;
  setWalletType(walletType: WalletType): void;
}

export const AddAccountPrivateKey = (props: Props) => {
  const form = usePrivateKeyForm();

  return <AddAccountPrivateKeyForm form={form} {...props} />;
};

const AddAccountPrivateKeyForm = ({
  flowHeader,
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
        {flowHeader}
        <WalletTypeSelector walletType={WalletType.PRIVATE_KEY} setWalletType={setWalletType} />
        <PrivateKeyForm form={form} onSubmit={handleSubmit} />
      </ScrollableContainer>
      <PanelBottom>
        <Button type="submit" form="private-key-form">
          {translateRaw('REVIEW_SECURITY_DETAILS')}
        </Button>
      </PanelBottom>
    </>
  );
};

import React, { useEffect } from 'react';

import { Account, ScrollableContainer, SignBottom } from '@app/components';
import { getSigningError, useSelector } from '@app/store';
import { SignTransactionProps, WalletType } from '@types';

import { PrivateKeyForm, usePrivateKeyForm } from '../forms/PrivateKeyForm';

export const SignTransactionPrivateKey = (props: SignTransactionProps) => {
  const form = usePrivateKeyForm();

  return <SignTransactionPrivateKeyForm form={form} {...props} />;
};

const SignTransactionPrivateKeyForm = ({
  form,
  onAccept,
  currentAccount
}: Pick<SignTransactionProps, 'onAccept' | 'currentAccount'> & {
  form: ReturnType<typeof usePrivateKeyForm>;
}) => {
  const error: string = useSelector(getSigningError);

  useEffect(() => {
    if (form.errorMap['privateKey'] !== error) {
      form.setError('privateKey', error);
    }
  }, [error]);

  const handleSubmit = () =>
    onAccept({ walletType: WalletType.PRIVATE_KEY, privateKey: form.values.privateKey });

  return (
    <>
      <ScrollableContainer>
        <Account address={currentAccount.address} truncate={false} bg="none" p="0" />
        <PrivateKeyForm form={form} onSubmit={handleSubmit} />
      </ScrollableContainer>
      <SignBottom disabled={form.error} form="private-key-form" />
    </>
  );
};

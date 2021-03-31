import React, { useEffect } from 'react';

import { Container, SignBottom } from '@app/components';
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
  onDeny
}: Pick<SignTransactionProps, 'onAccept' | 'onDeny'> & {
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
      <Container pt="0">
        <PrivateKeyForm form={form} onSubmit={handleSubmit} />
      </Container>
      <SignBottom disabled={form.error} handleDeny={onDeny} form="private-key-form" />
    </>
  );
};

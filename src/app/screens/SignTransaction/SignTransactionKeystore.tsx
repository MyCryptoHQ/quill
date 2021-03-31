import React, { useEffect } from 'react';

import { Container, SignBottom } from '@app/components';
import { getSigningError, useSelector } from '@app/store';
import { SignTransactionProps, WalletType } from '@types';

import { KeystoreForm, useKeystoreForm } from '../forms/KeystoreForm';

export const SignTransactionKeystore = (props: SignTransactionProps) => {
  const form = useKeystoreForm();

  return <SignTransactionKeystoreForm {...props} form={form} />;
};

const SignTransactionKeystoreForm = ({
  onAccept,
  onDeny,
  form
}: SignTransactionProps & { form: ReturnType<typeof useKeystoreForm> }) => {
  const error: string = useSelector(getSigningError);

  useEffect(() => {
    if (form.errorMap['keystore'] !== error) {
      form.setError('keystore', error);
    }
  }, [error]);

  const handleSubmit = () => {
    form.values.keystore
      .text()
      .then((keystore) =>
        onAccept({ walletType: WalletType.KEYSTORE, keystore, password: form.values.password })
      )
      .catch((err) => form.setError('keystore', err.message));
  };

  return (
    <>
      <Container pt="0">
        <KeystoreForm form={form} onSubmit={handleSubmit} />
      </Container>
      <SignBottom disabled={form.error} handleDeny={onDeny} form="keystore-form" />
    </>
  );
};

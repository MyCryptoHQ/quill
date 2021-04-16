import React, { useEffect } from 'react';

import { Body, Heading } from '@mycrypto/ui';

import { Account, ScrollableContainer, SignBottom } from '@app/components';
import { getSigningError, useSelector } from '@app/store';
import { translateRaw } from '@common/translate';
import { SignTransactionProps, WalletType } from '@types';

import { KeystoreForm, useKeystoreForm } from '../forms/KeystoreForm';

export const SignTransactionKeystore = (props: SignTransactionProps) => {
  const form = useKeystoreForm();

  return <SignTransactionKeystoreForm {...props} form={form} />;
};

const SignTransactionKeystoreForm = ({
  onAccept,
  form,
  currentAccount
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
      <ScrollableContainer>
        <Heading fontSize="24px" lineHeight="150%" mb="2" textAlign="center">
          {translateRaw('SIGNING_WITH_NON_PERSISTED_ACCOUNT_HEADER')}
        </Heading>
        <Body mb="3">{translateRaw('SIGNING_WITH_NON_PERSISTED_ACCOUNT_BODY')}</Body>
        <Account
          label={currentAccount.label}
          address={currentAccount.address}
          truncate={false}
          bg="none"
          p="0"
          addressColor="GREY_TEXT"
        />
        <KeystoreForm form={form} onSubmit={handleSubmit} />
      </ScrollableContainer>
      <SignBottom disabled={form.error} form="keystore-form" />
    </>
  );
};

import { Body, Heading } from '@mycrypto/ui';
import { getSigningError, translateRaw, WalletType } from '@quill/common';
import { useEffect } from 'react';

import { Account, ScrollableContainer, SignBottom } from '@app/components';
import { useSelector } from '@app/store';
import type { SignTransactionProps } from '@types';

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
        <PrivateKeyForm form={form} onSubmit={handleSubmit} />
      </ScrollableContainer>
      <SignBottom disabled={form.error} form="private-key-form" />
    </>
  );
};

import React, { useEffect } from 'react';

import { Account, Container, SignBottom, Wrapper } from '@app/components';
import { getSigningError, useSelector } from '@app/store';
import { SignTransactionProps, WalletType } from '@types';

import { MnemonicForm, useMnemonicForm } from '../forms/MnemonicForm';

export const SignTransactionMnemonic = (props: SignTransactionProps) => {
  const form = useMnemonicForm();

  return <SignTransactionMnemonicForm form={form} {...props} />;
};

const SignTransactionMnemonicForm = ({
  form,
  onAccept,
  onDeny,
  currentAccount
}: Pick<SignTransactionProps, 'onAccept' | 'onDeny' | 'currentAccount'> & {
  form: ReturnType<typeof useMnemonicForm>;
}) => {
  const error: string = useSelector(getSigningError);

  useEffect(() => {
    if (form.errorMap['mnemonic'] !== error) {
      form.setError('mnemonic', error);
    }
  }, [error]);

  const handleSubmit = async () => {
    return onAccept({
      walletType: WalletType.MNEMONIC,
      mnemonicPhrase: form.values.mnemonic,
      passphrase: form.values.password,
      path: currentAccount.dPath!
    });
  };

  return (
    <>
      <Wrapper>
        <Container>
          <Account address={currentAccount.address} truncate={false} bg="none" p="0" />
          <MnemonicForm form={form} onSubmit={handleSubmit} />
        </Container>
      </Wrapper>
      <SignBottom disabled={form.error} handleDeny={onDeny} form="mnemonic-phrase-form" />
    </>
  );
};

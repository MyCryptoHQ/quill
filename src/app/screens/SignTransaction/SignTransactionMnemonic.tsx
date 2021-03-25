import React, { useEffect } from 'react';

import { SignBottom } from '@app/components';
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
    if (form.errorMap['mnemonic'] != error) {
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
    <MnemonicForm form={form} onSubmit={handleSubmit}>
      <SignBottom disabled={form.error} handleDeny={onDeny} />
    </MnemonicForm>
  );
};

import React, { useEffect } from 'react';

import { SignBottom } from '@app/components';
import { getSigningError, useSelector } from '@app/store';
import { SignTransactionProps, WalletType } from '@types';

import { MnemonicForm, useMnemonicForm } from '../forms/MnemonicForm';

export const SignTransactionMnemonic = ({
  onAccept,
  onDeny,
  currentAccount
}: SignTransactionProps) => {
  const form = useMnemonicForm();

  const error: string = useSelector(getSigningError);

  useEffect(() => {
    if (error && error.length > 0) {
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

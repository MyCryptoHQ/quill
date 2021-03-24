import React from 'react';

import { SignBottom } from '@app/components';
import { SignTransactionProps, WalletType } from '@types';

import { KeystoreForm, useKeystoreForm } from '../forms/KeystoreForm';

export const SignTransactionKeystore = ({ onAccept, onDeny }: SignTransactionProps) => {
  const form = useKeystoreForm();

  const handleSubmit = () => {
    // @todo Handle errors
    form.values.keystore
      .text()
      .then((keystore) =>
        onAccept({ walletType: WalletType.KEYSTORE, keystore, password: form.values.password })
      );
  };

  return (
    <KeystoreForm form={form} onSubmit={handleSubmit}>
      <SignBottom disabled={form.error} handleDeny={onDeny} />
    </KeystoreForm>
  );
};

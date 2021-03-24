import React, { useEffect } from 'react';

import { SignBottom } from '@app/components';
import { getSigningError, useSelector } from '@app/store';
import { SignTransactionProps, WalletType } from '@types';

import { KeystoreForm, useKeystoreForm } from '../forms/KeystoreForm';

export const SignTransactionKeystore = ({ onAccept, onDeny }: SignTransactionProps) => {
  const form = useKeystoreForm();

  const error: string = useSelector(getSigningError);

  useEffect(() => {
    if (error && error.length > 0) {
      form.setError('keystore', error);
    }
  }, [error]);

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

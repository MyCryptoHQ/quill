import React, { useEffect } from 'react';

import { SignBottom } from '@app/components';
import { getSigningError, useSelector } from '@app/store';
import { SignTransactionProps, WalletType } from '@types';

import { PrivateKeyForm, usePrivateKeyForm } from '../forms/PrivateKeyForm';

export const SignTransactionPrivateKey = ({ onAccept, onDeny }: SignTransactionProps) => {
  const form = usePrivateKeyForm();

  const error: string = useSelector(getSigningError);

  useEffect(() => {
    if (error && error.length > 0) {
      form.setError('privateKey', error);
    }
  }, [error]);

  const handleSubmit = () =>
    onAccept({ walletType: WalletType.PRIVATE_KEY, privateKey: form.values.privateKey });

  return (
    <PrivateKeyForm form={form} onSubmit={handleSubmit}>
      <SignBottom disabled={form.error} handleDeny={onDeny} />
    </PrivateKeyForm>
  );
};

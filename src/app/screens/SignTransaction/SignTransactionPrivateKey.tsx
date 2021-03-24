import React from 'react';

import { SignBottom } from '@app/components';
import { SignTransactionProps, WalletType } from '@types';

import { PrivateKeyForm, usePrivateKeyForm } from '../forms/PrivateKeyForm';

export const SignTransactionPrivateKey = ({ onAccept, onDeny }: SignTransactionProps) => {
  const form = usePrivateKeyForm();
  const handleSubmit = () =>
    onAccept({ walletType: WalletType.PRIVATE_KEY, privateKey: form.values.privateKey });

  return (
    <PrivateKeyForm form={form} onSubmit={handleSubmit}>
      <SignBottom disabled={form.error} handleDeny={onDeny} />
    </PrivateKeyForm>
  );
};

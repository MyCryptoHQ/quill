import React from 'react';

import { Body, Box, Button, FormCheckbox, PanelBottom } from '@app/components';
import { fetchAccounts, useDispatch } from '@app/store';
import { translateRaw } from '@translations';
import { WalletType } from '@types';

import { PrivateKeyForm, usePrivateKeyForm } from '../forms/PrivateKeyForm';

export const AddAccountPrivateKey = () => {
  const form = usePrivateKeyForm();
  const dispatch = useDispatch();

  const handleSubmit = () => {
    dispatch(
      fetchAccounts([
        {
          walletType: WalletType.PRIVATE_KEY,
          privateKey: form.values.privateKey,
          persistent: form.values.persistent
        }
      ])
    );
  };

  return (
    <PrivateKeyForm form={form} onSubmit={handleSubmit}>
      <PanelBottom pb="24px">
        <Button type="submit">{translateRaw('SUBMIT')}</Button>
        <Box pt="2" variant="rowAlign">
          <FormCheckbox name="persistent" form={form} data-testid="toggle-persistence" />
          <Body pl="2">{translateRaw('PERSISTENCE_CHECKBOX')}</Body>
        </Box>
      </PanelBottom>
    </PrivateKeyForm>
  );
};

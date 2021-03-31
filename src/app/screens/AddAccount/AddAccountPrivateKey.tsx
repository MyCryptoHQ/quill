import React, { useEffect } from 'react';

import { fetchAccounts, getAccountError, useDispatch, useSelector } from '@app/store';
import { Body, Box, Button, Container, FormCheckbox, PanelBottom } from '@components';
import { translateRaw } from '@translations';
import { WalletType } from '@types';

import { PrivateKeyForm, usePrivateKeyForm } from '../forms/PrivateKeyForm';

export const AddAccountPrivateKey = () => {
  const form = usePrivateKeyForm();

  return <AddAccountPrivateKeyForm form={form} />;
};

const AddAccountPrivateKeyForm = ({ form }: { form: ReturnType<typeof usePrivateKeyForm> }) => {
  const dispatch = useDispatch();
  const error: string = useSelector(getAccountError);

  useEffect(() => {
    if (form.errorMap['privateKey'] !== error) {
      form.setError('privateKey', error);
    }
  }, [error]);

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
    <>
      <Container pt="0">
        <PrivateKeyForm form={form} onSubmit={handleSubmit} />
      </Container>
      <PanelBottom pb="24px">
        <Button type="submit" form="private-key-form">
          {translateRaw('SUBMIT')}
        </Button>
        <Box pt="2" variant="rowAlign">
          <FormCheckbox name="persistent" form={form} data-testid="toggle-persistence" />
          <Body pl="2">{translateRaw('PERSISTENCE_CHECKBOX')}</Body>
        </Box>
      </PanelBottom>
    </>
  );
};

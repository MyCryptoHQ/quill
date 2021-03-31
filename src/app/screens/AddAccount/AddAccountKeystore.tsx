import React, { useEffect } from 'react';

import { fetchAccounts, getAccountError, useDispatch, useSelector } from '@app/store';
import { Body, Box, Button, Container, FormCheckbox, PanelBottom } from '@components';
import { translateRaw } from '@translations';
import { WalletType } from '@types';

import { KeystoreForm, useKeystoreForm } from '../forms/KeystoreForm';

export const AddAccountKeystore = () => {
  const form = useKeystoreForm();

  return <AddAccountKeystoreForm form={form} />;
};

const AddAccountKeystoreForm = ({ form }: { form: ReturnType<typeof useKeystoreForm> }) => {
  const dispatch = useDispatch();
  const error: string = useSelector(getAccountError);

  useEffect(() => {
    if (form.errorMap['keystore'] !== error) {
      form.setError('keystore', error);
    }
  }, [error]);

  const handleSubmit = () => {
    form.values.keystore
      .text()
      .then((keystore) => {
        dispatch(
          fetchAccounts([
            {
              walletType: WalletType.KEYSTORE,
              keystore,
              password: form.values.password,
              persistent: form.values.persistent
            }
          ])
        );
      })
      .catch((err) => form.setError('keystore', err.message));
  };

  return (
    <>
      <Container pt="0">
        <KeystoreForm form={form} onSubmit={handleSubmit} />
      </Container>
      <PanelBottom pb="24px">
        <Button type="submit" form="keystore-form">
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

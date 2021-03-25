import React, { useEffect } from 'react';

import { Body, Box, Button, FormCheckbox, PanelBottom } from '@app/components';
import { fetchAccounts, getAccountError, useDispatch, useSelector } from '@app/store';
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
    if (form.errorMap['keystore'] != error) {
      form.setError('keystore', error);
    }
  }, [error]);

  const handleSubmit = () => {
    // @todo Handle errors
    form.values.keystore.text().then((keystore) => {
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
    });
  };

  return (
    <KeystoreForm form={form} onSubmit={handleSubmit}>
      <PanelBottom pb="24px">
        <Button type="submit">{translateRaw('SUBMIT')}</Button>
        <Box pt="2" variant="rowAlign">
          <FormCheckbox name="persistent" form={form} data-testid="toggle-persistence" />
          <Body pl="2">{translateRaw('PERSISTENCE_CHECKBOX')}</Body>
        </Box>
      </PanelBottom>
    </KeystoreForm>
  );
};

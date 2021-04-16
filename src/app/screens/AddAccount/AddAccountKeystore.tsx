import React, { useEffect } from 'react';

import { Body } from '@mycrypto/ui';

import { fetchAccounts, getAccountError, useDispatch, useSelector } from '@app/store';
import { translateRaw } from '@common/translate';
import {
  Box,
  Button,
  FormCheckbox,
  PanelBottom,
  ScrollableContainer,
  WalletTypeSelector
} from '@components';
import { WalletType } from '@types';

import { KeystoreForm, useKeystoreForm } from '../forms/KeystoreForm';

interface Props {
  setWalletType(walletType: WalletType): void;
}

export const AddAccountKeystore = ({ setWalletType }: Props) => {
  const form = useKeystoreForm();

  return <AddAccountKeystoreForm form={form} setWalletType={setWalletType} />;
};

const AddAccountKeystoreForm = ({
  form,
  setWalletType
}: { form: ReturnType<typeof useKeystoreForm> } & Props) => {
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
      <ScrollableContainer>
        <WalletTypeSelector walletType={WalletType.KEYSTORE} setWalletType={setWalletType} />
        <KeystoreForm form={form} onSubmit={handleSubmit} />
      </ScrollableContainer>
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

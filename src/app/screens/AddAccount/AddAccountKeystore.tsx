import { Button } from '@mycrypto/ui';
import { useEffect } from 'react';

import { useDispatch, useSelector } from '@app/store';
import { fetchAccounts, getAccountError } from '@common/store';
import { translateRaw } from '@common/translate';
import { PanelBottom, ScrollableContainer, WalletTypeSelector } from '@components';
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
              password: form.values.password
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
      <PanelBottom>
        <Button type="submit" form="keystore-form">
          {translateRaw('VERIFY_ACCOUNT')}
        </Button>
      </PanelBottom>
    </>
  );
};

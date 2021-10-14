import { Button } from '@mycrypto/ui';
import { fetchAccounts, getAccountError, translateRaw, WalletType } from '@quill/common';
import type { ReactElement } from 'react';
import { useEffect } from 'react';

import { useDispatch, useSelector } from '@app/store';
import { PanelBottom, ScrollableContainer, WalletTypeSelector } from '@components';

import { KeystoreForm, useKeystoreForm } from '../../forms/KeystoreForm';

interface Props {
  flowHeader: ReactElement;
  setWalletType(walletType: WalletType): void;
}

export const AddAccountKeystore = (props: Props) => {
  const form = useKeystoreForm();

  return <AddAccountKeystoreForm form={form} {...props} />;
};

const AddAccountKeystoreForm = ({
  flowHeader,
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
        {flowHeader}
        <WalletTypeSelector walletType={WalletType.KEYSTORE} setWalletType={setWalletType} />
        <KeystoreForm form={form} onSubmit={handleSubmit} />
      </ScrollableContainer>
      <PanelBottom>
        <Button type="submit" form="keystore-form">
          {translateRaw('REVIEW_SECURITY_DETAILS')}
        </Button>
      </PanelBottom>
    </>
  );
};

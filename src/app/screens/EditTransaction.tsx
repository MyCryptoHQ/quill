import { Body, Button } from '@mycrypto/ui';
import { replace } from 'connected-react-router';
import type { FormEvent } from 'react';
import { is } from 'superstruct';
import { useForm, yupValidator } from 'typed-react-form';
import { number, object, string } from 'yup';

import {
  Box,
  FromToAccount,
  Image,
  LinkApp,
  PanelBottom,
  ScrollableContainer,
  TimeElapsed,
  TxDetailsEdit,
  TxInfoBanner
} from '@app/components';
import { ROUTE_PATHS } from '@app/routing';
import { useDispatch, useSelector } from '@app/store';
import { fromHumanReadable, toHumanReadable } from '@app/utils';
import edit from '@assets/icons/edit.svg';
import { getAccounts, getCurrentTransaction, getTransactionInfoBannerType } from '@common/store';
import { selectTransaction, update } from '@common/store/transactions.slice';
import { translateRaw } from '@common/translate';
import type { TxQueueEntry } from '@types';
import { EvenHex } from '@types';

const SCHEMA = object({
  value: number().required(),
  nonce: number().required(),
  gasPrice: number().required(),
  gasLimit: number().required(),
  chainId: number().required(),
  data: string()
    .required()
    .test('valid-hex', (value) => is(value, EvenHex))
});

export const EditTransaction = () => {
  const accounts = useSelector(getAccounts);
  const currentTx = useSelector(getCurrentTransaction) as TxQueueEntry;
  const dispatch = useDispatch();
  const { tx, timestamp, origin } = currentTx;
  const currentAccount = tx && accounts.find((a) => a.address === tx.from);
  const recipientAccount = tx && accounts.find((a) => a.address === tx.to);
  const info = useSelector(getTransactionInfoBannerType);

  const form = useForm(toHumanReadable(tx), yupValidator(SCHEMA), true);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await form.validate();
    if (form.error) {
      return;
    }
    const tx = fromHumanReadable(form.values);
    const queueItem = { ...currentTx, tx, adjustedNonce: false, userEdited: true };
    dispatch(update(queueItem));
    dispatch(selectTransaction(queueItem));
    dispatch(replace(ROUTE_PATHS.TX));
  };

  return (
    <>
      <ScrollableContainer>
        <form onSubmit={handleSubmit} id="edit-tx-form">
          <Box>
            <TxInfoBanner type={info} />
            <FromToAccount
              sender={{ address: tx.from, label: currentAccount?.label }}
              recipient={tx.to && { address: tx.to, label: recipientAccount?.label }}
            />
            <Box variant="horizontal-start">
              <Body fontSize="14px" color="BLUE_GREY" mb="2" mt="2">
                {translateRaw('REQUEST_ORIGIN', { $origin: origin ?? translateRaw('UNKNOWN') })}{' '}
                <TimeElapsed value={timestamp} />
              </Body>
              <LinkApp href="#" variant="barren" ml="auto">
                <Image src={edit} height="20px" width="20px" />
              </LinkApp>
            </Box>
            <TxDetailsEdit form={form} />
          </Box>
        </form>
      </ScrollableContainer>
      <PanelBottom py="3">
        <Button type="submit" disabled={form.error} form="edit-tx-form">
          {translateRaw('SAVE_SETTINGS')}
        </Button>
      </PanelBottom>
    </>
  );
};

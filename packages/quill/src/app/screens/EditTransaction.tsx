import { Body, Button, Image } from '@mycrypto/ui';
import {
  bigify,
  EvenHex,
  getAccounts,
  getCurrentTransaction,
  getTransactionInfoBannerType,
  selectTransaction,
  translateRaw,
  update
} from '@quill/common';
import type { TransactionRequest, TxQueueEntry } from '@quill/common';
import { replace } from 'connected-react-router';
import type { FormEvent } from 'react';
import { is } from 'superstruct';
import { useForm, yupValidator } from 'typed-react-form';
import { number, object, string } from 'yup';

import {
  Box,
  FromToAccount,
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
import edit from '@assets/icons/edit-grey.svg';
import {
  GAS_LIMIT_LOWER_BOUND,
  GAS_LIMIT_UPPER_BOUND,
  GAS_PRICE_GWEI_LOWER_BOUND,
  GAS_PRICE_GWEI_UPPER_BOUND
} from '@config';

const getSchema = (tx: TransactionRequest) => {
  const common = object({
    value: number().required().min(0),
    nonce: number().required().min(0),
    gasLimit: number().required().min(GAS_LIMIT_LOWER_BOUND).max(GAS_LIMIT_UPPER_BOUND),
    chainId: number().required().min(1),
    data: string()
      .required()
      .test('valid-hex', (value) => is(value, EvenHex))
  });

  if (tx.type === 2) {
    return common.shape({
      maxFeePerGas: number()
        .required()
        .min(GAS_PRICE_GWEI_LOWER_BOUND)
        .max(GAS_PRICE_GWEI_UPPER_BOUND),
      maxPriorityFeePerGas: number()
        .required()
        .min(GAS_PRICE_GWEI_LOWER_BOUND)
        .max(GAS_PRICE_GWEI_UPPER_BOUND)
        .test('check-max', translateRaw('PRIORITY_FEE_MAX_ERROR'), function (value) {
          const maxFeePerGas = this.parent.maxFeePerGas;
          return bigify(maxFeePerGas).gte(value);
        })
    });
  }

  return common.shape({
    gasPrice: number().required().min(GAS_PRICE_GWEI_LOWER_BOUND).max(GAS_PRICE_GWEI_UPPER_BOUND)
  });
};

export const EditTransaction = () => {
  const accounts = useSelector(getAccounts);
  const currentTx = useSelector(getCurrentTransaction) as TxQueueEntry;
  const dispatch = useDispatch();
  const { tx, receivedTimestamp, origin } = currentTx;
  const currentAccount = tx && accounts.find((a) => a.address === tx.from);
  const recipientAccount = tx && accounts.find((a) => a.address === tx.to);
  const info = useSelector(getTransactionInfoBannerType);
  const schema = getSchema(tx);

  const form = useForm(toHumanReadable(tx), yupValidator(schema), true);

  const handleCancel = () => {
    dispatch(replace(ROUTE_PATHS.TX));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await form.validate();
    if (form.error) {
      return;
    }
    const tx = fromHumanReadable(form.values);
    const queueItem = { ...currentTx, tx, userEdited: true };
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
              <Body fontSize="2" color="BLUE_GREY" mb="2" mt="2">
                {translateRaw('REQUEST_ORIGIN', { $origin: origin ?? translateRaw('UNKNOWN') })}{' '}
                <TimeElapsed value={receivedTimestamp} />
              </Body>
              <Image src={edit} height="20px" width="20px" ml="auto" />
            </Box>
            <TxDetailsEdit form={form} />
          </Box>
        </form>
      </ScrollableContainer>
      <PanelBottom py="24px">
        <Button type="submit" form="edit-tx-form">
          {translateRaw('SAVE_TX_DETAILS')}
        </Button>
        <Box width="100%" pt="3" px="3" sx={{ textAlign: 'center' }}>
          <LinkApp href="#" onClick={handleCancel}>
            {translateRaw('CANCEL')}
          </LinkApp>
        </Box>
      </PanelBottom>
    </>
  );
};

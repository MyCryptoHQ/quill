import { parse } from '@ethersproject/transactions';
import { Body, Button, Heading } from '@mycrypto/ui';
import type { IAccount, TUuid } from '@signer/common';
import {
  enqueue,
  getAccounts,
  isRawTransaction,
  makeQueueTx,
  toTransactionRequest,
  translateRaw
} from '@signer/common';
import { push } from 'connected-react-router';
import type { FormEvent } from 'react';
import { useForm, yupValidator } from 'typed-react-form';
import { object, string } from 'yup';

import { Box, Container, FormError, FormTextArea, Label, PanelBottom } from '@components';
import { AccountSelector } from '@components/AccountSelector';
import { useNavigation } from '@hooks';
import { ROUTE_PATHS } from '@routing';
import { useDispatch, useSelector } from '@store';

const SCHEMA = object({
  account: string()
    .required(translateRaw('ACCOUNT_EMPTY'))
    .typeError(translateRaw('ACCOUNT_EMPTY')),
  transaction: string()
    .required(translateRaw('TRANSACTION_EMPTY'))
    .test('valid-raw-transaction', translateRaw('NOT_RAW_TRANSACTION'), isRawTransaction)
});

export const LoadTransaction = () => {
  const dispatch = useDispatch();
  const accounts = useSelector(getAccounts);

  const form = useForm<{ transaction: string; account: TUuid }>(
    {
      transaction: '',
      account: null as TUuid
    },
    yupValidator(SCHEMA, {
      abortEarly: false
    })
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await form.validate();
    if (form.error) {
      return;
    }

    const account = accounts.find((a) => a.uuid === form.values.account);
    const transaction = parse(form.values.transaction);

    const queueTransaction = makeQueueTx(
      toTransactionRequest({
        ...transaction,
        from: account.address
      }),
      true
    );

    dispatch(enqueue(queueTransaction));
    dispatch(push(ROUTE_PATHS.HOME));
  };

  const handleSelectAccount = (account: IAccount) => form.setValue('account', account.uuid);

  useNavigation(ROUTE_PATHS.MENU);

  return (
    <>
      <Container>
        <Box sx={{ textAlign: 'center' }}>
          <Heading fontSize="24px" lineHeight="36px" mt="3" mb="2">
            {translateRaw('MANUALLY_LOAD_TRANSACTION_HEADER')}
          </Heading>
        </Box>
        <Body lineHeight="24px" mb="4">
          {translateRaw('MANUALLY_LOAD_TRANSACTION_DESCRIPTION')}
        </Body>
        <Box mb="2">
          <Label htmlFor="account">{translateRaw('ACCOUNT')}</Label>
          <AccountSelector
            currentAccount={form.values.account}
            accounts={accounts}
            onChange={handleSelectAccount}
          />
          <FormError name="account" form={form} />
        </Box>
        <form id="load-transaction-form" onSubmit={handleSubmit}>
          <Box>
            <Label htmlFor="raw-transaction">{translateRaw('RAW_TRANSACTION_DETAILS')}</Label>
            <FormTextArea
              form={form}
              id="raw-transaction"
              name="transaction"
              placeholder={translateRaw('RAW_TRANSACTION_PLACEHOLDER')}
              sx={{ resize: 'vertical' }}
            />
            <FormError name="transaction" form={form} />
          </Box>
        </form>
      </Container>
      <PanelBottom variant="clear">
        <Button type="submit" form="load-transaction-form">
          {translateRaw('LOAD_TRANSACTION')}
        </Button>
      </PanelBottom>
    </>
  );
};

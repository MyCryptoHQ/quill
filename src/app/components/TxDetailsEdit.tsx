import { formatEther } from '@ethersproject/units';
import type { ReactNode } from 'react';
import type { FormState } from 'typed-react-form';

import { translateRaw } from '@common/translate';
import { getChain } from '@data';
import type { TransactionRequest } from '@types';
import { bigify } from '@utils';

import { Box } from '.';
import { FormInput } from './FormInput';
import { FormTextArea } from './FormTextArea';
import { TxDetailsBlockRow as BlockRow } from './TxDetailsBlockRow';
import { TxDetailsRow as Row } from './TxDetailsRow';

const InputRow = ({ label, value }: { label: string; value: string | ReactNode }) => (
  <Row label={label} value={<Box>{value}</Box>} />
);

export const TxDetailsEdit = ({ form }: { form: FormState<TransactionRequest> }) => {
  const tx = form.values;
  const chain = getChain(tx.chainId);
  const maxTxFee = bigify(tx.gasPrice).multipliedBy(bigify(tx.gasLimit));
  const symbol = chain?.nativeCurrency?.symbol ?? '?';
  return (
    <>
      <InputRow
        label={translateRaw('TX_DETAILS_AMOUNT')}
        value={<FormInput id="value" name="value" type="number" form={form} />}
      />
      <InputRow
        label={translateRaw('NETWORK')}
        value={<FormInput id="chainId" name="chainId" type="number" form={form} />}
      />
      <InputRow
        label={translateRaw('GAS_LIMIT')}
        value={<FormInput id="gasLimit" name="gasLimit" type="number" form={form} />}
      />
      <InputRow
        label={translateRaw('GAS_PRICE')}
        value={<FormInput id="gasPrice" name="gasPrice" type="number" form={form} />}
      />
      <InputRow
        label={translateRaw('MAX_TX_FEE')}
        value={`${formatEther(maxTxFee.toString())} ${symbol}`}
      />
      <InputRow
        label={translateRaw('NONCE')}
        value={<FormInput id="nonce" name="nonce" type="number" form={form} />}
      />
      <BlockRow label={translateRaw('DATA')} hideDivider={true}>
        <FormTextArea id="data" name="data" form={form} />
      </BlockRow>
    </>
  );
};

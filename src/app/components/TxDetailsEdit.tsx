import { formatEther, parseUnits } from '@ethersproject/units';
import { Body } from '@mycrypto/ui';
import type { ComponentProps } from 'react';
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

const InputRow = ({
  label,
  unit,
  ...props
}: { label: string; unit?: string } & ComponentProps<typeof FormInput>) => (
  <Row
    py="2"
    label={label}
    value={
      <Box variant="horizontal-start" width="45%">
        {/* @ts-ignore for now */}
        <FormInput
          {...props}
          pr={unit && '3rem'}
          sx={{ textAlign: 'right' }}
          css={`
            ::-webkit-inner-spin-button {
              -webkit-appearance: none;
              margin: 0;
            }
            ::-webkit-outer-spin-button {
              -webkit-appearance: none;
              margin: 0;
            }
          `}
        />
        {unit && <Body ml="-3rem">{unit}</Body>}
      </Box>
    }
  />
);

export const TxDetailsEdit = ({ form }: { form: FormState<TransactionRequest> }) => {
  const tx = form.values;
  const chain = getChain(tx.chainId);
  const maxTxFee = bigify(parseUnits(tx.gasPrice.toString(), 'gwei')).multipliedBy(
    bigify(tx.gasLimit)
  );
  const symbol = chain?.nativeCurrency?.symbol ?? '?';
  return (
    <>
      <InputRow
        label={translateRaw('TX_DETAILS_AMOUNT')}
        id="value"
        name="value"
        form={form}
        unit={symbol}
      />
      <InputRow
        label={translateRaw('NETWORK')}
        id="chainId"
        name="chainId"
        type="number"
        form={form}
      />
      <InputRow label={translateRaw('GAS_LIMIT')} id="gasLimit" name="gasLimit" form={form} />
      <InputRow
        label={translateRaw('GAS_PRICE')}
        id="gasPrice"
        name="gasPrice"
        unit="Gwei"
        form={form}
      />
      <Row
        label={translateRaw('MAX_TX_FEE')}
        value={`${formatEther(maxTxFee.toString())} ${symbol}`}
        py="1rem"
      />
      <InputRow label={translateRaw('NONCE')} id="nonce" name="nonce" type="number" form={form} />
      <BlockRow label={translateRaw('DATA')} hideDivider={true}>
        <FormTextArea id="data" name="data" form={form} />
      </BlockRow>
    </>
  );
};

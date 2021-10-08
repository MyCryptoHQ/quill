import { formatEther, parseUnits } from '@ethersproject/units';
import { Body } from '@mycrypto/ui';
import { bigify, translateRaw } from '@signer/common';
import type { ComponentProps } from 'react';
import type { FormState } from 'typed-react-form';

import type { HumanReadableTx } from '@app/utils';
import { sanitizeGasPriceInput } from '@app/utils';
import { getChain } from '@data';

import { FormInput } from './FormInput';
import { FormTextArea } from './FormTextArea';
import { Box } from './index';
import { TxDetailsBlockRow as BlockRow } from './TxDetailsBlockRow';
import { TxDetailsRow as Row } from './TxDetailsRow';
import { ValidatedListener } from './ValidatedListener';

type EditTxType = Pick<
  HumanReadableTx,
  | 'gasLimit'
  | 'gasPrice'
  | 'chainId'
  | 'data'
  | 'value'
  | 'nonce'
  | 'maxFeePerGas'
  | 'maxPriorityFeePerGas'
  | 'type'
>;

type InputRowProps = {
  label: string;
  unit?: string;
  form: FormState<EditTxType>;
  name: keyof EditTxType;
  value?: EditTxType[keyof EditTxType];
} & Omit<ComponentProps<typeof FormInput>, 'form'>;

const InputRow = ({ label, unit, form, ...props }: InputRowProps) => (
  <Row
    py="2"
    label={label}
    value={
      <Box variant="horizontal-start" width="45%">
        <FormInput
          {...props}
          form={form}
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

export const TxDetailsEdit = ({ form }: { form: FormState<EditTxType> }) => {
  const tx = form.values;
  const chain = getChain(tx.chainId);
  const symbol = chain?.nativeCurrency?.symbol ?? '?';
  const isEIP1559 = tx.type === 2;
  return (
    <>
      <InputRow
        label={translateRaw('TX_DETAILS_AMOUNT')}
        id="value"
        name="value"
        form={form}
        unit={symbol}
      />
      <InputRow label={translateRaw('GAS_LIMIT')} id="gasLimit" name="gasLimit" form={form} />
      {isEIP1559 ? (
        <>
          <InputRow
            label={translateRaw('MAX_FEE')}
            id="maxFeePerGas"
            name="maxFeePerGas"
            unit="Gwei"
            form={form}
            processInput={sanitizeGasPriceInput}
          />
          <InputRow
            label={translateRaw('MAX_PRIORITY_FEE')}
            id="maxPriorityFeePerGas"
            name="maxPriorityFeePerGas"
            unit="Gwei"
            form={form}
            processInput={sanitizeGasPriceInput}
          />
        </>
      ) : (
        <InputRow
          label={translateRaw('GAS_PRICE')}
          id="gasPrice"
          name="gasPrice"
          unit="Gwei"
          form={form}
          processInput={sanitizeGasPriceInput}
        />
      )}

      <ValidatedListener
        form={form}
        render={(values) => (
          <Row
            label={translateRaw('MAX_TX_FEE')}
            value={`${formatEther(
              bigify(
                parseUnits(
                  isEIP1559 ? values.maxFeePerGas.toString() : values.gasPrice.toString(),
                  'gwei'
                )
              )
                .multipliedBy(bigify(values.gasLimit))
                .toString()
            )} ${symbol}`}
            py="1rem"
          />
        )}
      />
      <InputRow label={translateRaw('NONCE')} id="nonce" name="nonce" type="number" form={form} />
      <InputRow
        label={translateRaw('NETWORK')}
        id="chainId"
        name="chainId"
        type="number"
        form={form}
      />
      <BlockRow label={translateRaw('DATA')} hideDivider={true}>
        <FormTextArea id="data" name="data" form={form} />
      </BlockRow>
      {tx.type && tx.type > 0 && <Row label={translateRaw('TX_TYPE')} value={tx.type} />}
    </>
  );
};

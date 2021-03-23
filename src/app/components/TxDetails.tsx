import React from 'react';

import { formatEther, formatUnits } from '@ethersproject/units';

import { getChain } from '@data';
import { translateRaw } from '@translations';
import { TransactionRequest } from '@types';
import { bigify } from '@utils';

import { Body, Box } from '.';
import { CodeBlock } from './CodeBlock';
import { Divider } from './Divider';

const Row = ({
  label,
  value,
  hideDivider
}: {
  label: string;
  value: string;
  hideDivider?: boolean;
}) => (
  <>
    <Box variant="rowAlign" sx={{ justifyContent: 'space-between' }} pb="1" pt="1">
      <Body fontWeight="bold">{label}:</Body>
      <Body>{value}</Body>
    </Box>
    {!hideDivider && <Divider />}
  </>
);

const BlockRow = ({
  label,
  children,
  hideDivider
}: {
  label: string;
  children: React.ReactNode;
  hideDivider?: boolean;
}) => (
  <>
    <Box pb="1" pt="1">
      <Body fontWeight="bold">{label}:</Body>
      {children}
    </Box>
    {!hideDivider && <Divider />}
  </>
);

export const TxDetails = ({ tx }: { tx: TransactionRequest }) => {
  const chain = getChain(tx.chainId);
  const maxTxFee = bigify(tx.gasPrice).multipliedBy(bigify(tx.gasLimit));
  const symbol = chain?.nativeCurrency?.symbol ?? '?';
  const network = chain.name ?? translateRaw('UNKNOWN_NETWORK');
  const data = tx.data?.toString() ?? '0x';
  return (
    <>
      <Row label={translateRaw('TX_DETAILS_AMOUNT')} value={`${formatEther(tx.value)} ${symbol}`} />
      <Row label={translateRaw('NETWORK')} value={`${network} (${tx.chainId.toString()})`} />
      <Row label={translateRaw('GAS_LIMIT')} value={bigify(tx.gasLimit).toString()} />
      <Row label={translateRaw('GAS_PRICE')} value={`${formatUnits(tx.gasPrice, 'gwei')} Gwei`} />
      <Row
        label={translateRaw('MAX_TX_FEE')}
        value={`${formatEther(maxTxFee.toString())} ${symbol}`}
      />
      <Row label={translateRaw('NONCE')} value={bigify(tx.nonce).toString()} />
      {data === '0x' ? (
        <Row label={translateRaw('DATA')} value={translateRaw('TX_DETAILS_DATA_EMPTY')} />
      ) : (
        <BlockRow label={translateRaw('DATA')} hideDivider={true}>
          <CodeBlock>{data}</CodeBlock>
        </BlockRow>
      )}
    </>
  );
};

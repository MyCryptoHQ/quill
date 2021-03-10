import React from 'react';

import { getChain } from '@data';
import { formatEther, formatUnits } from '@ethersproject/units';

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
  const network = chain.name ?? 'Unknown Network';
  const data = tx.data?.toString() ?? '0x';
  return (
    <>
      <Row label="TX Amount" value={`${formatEther(tx.value)} ${symbol}`} />
      <Row label="Network" value={`${network} (${tx.chainId.toString()})`} />
      <Row label="Gas Limit" value={bigify(tx.gasLimit).toString()} />
      <Row label="Gas Price" value={`${formatUnits(tx.gasPrice, 'gwei')} Gwei`} />
      <Row label="Max TX Fee" value={`${formatEther(maxTxFee.toString())} ${symbol}`} />
      <Row label="Nonce" value={bigify(tx.nonce).toString()} />
      {data === '0x' ? (
        <Row label="Data" value="(none)" />
      ) : (
        <BlockRow label="Data" hideDivider={true}>
          <CodeBlock>{data}</CodeBlock>
        </BlockRow>
      )}
    </>
  );
};

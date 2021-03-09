import React from 'react';

import { formatEther, formatUnits } from '@ethersproject/units';

import { TransactionRequest } from '@types';
import { bigify } from '@utils';

import { Body, Box } from '.';
import { Divider } from './Divider';

const Row = ({ label, value }: { label: string; value: string }) => (
  <>
    <Box variant="rowAlign" sx={{ justifyContent: 'space-between' }} pb="1" pt="1">
      <Body fontWeight="bold">{label}:</Body>
      <Body>{value}</Body>
    </Box>
    <Divider />
  </>
);

export const TxDetails = ({ tx }: { tx: TransactionRequest }) => {
  const maxTxFee = bigify(tx.gasPrice).multipliedBy(bigify(tx.gasLimit));
  return (
    <>
      <Row label="TX Amount" value={`${formatEther(tx.value)} ETH`} />
      <Row label="Network" value={tx.chainId.toString()} />
      <Row label="Gas Limit" value={bigify(tx.gasLimit).toString()} />
      <Row label="Gas Price" value={`${formatUnits(tx.gasPrice, 'gwei')} GWEI`} />
      <Row label="Max TX Fee" value={`${formatEther(maxTxFee.toString())} ETH`} />
      <Row label="Nonce" value={bigify(tx.nonce).toString()} />
      <Row label="Data" value={tx.data.toString()} />
    </>
  );
};

import { formatEther, formatUnits } from '@ethersproject/units';
import { Body } from '@mycrypto/ui';
import type { ReactNode } from 'react';

import warning from '@assets/icons/circle-warning.svg';
import { translateRaw } from '@common/translate';
import { getChain } from '@data';
import type { TxHistoryEntry, TxQueueEntry } from '@types';
import { bigify } from '@utils';

import { Box, Image } from '.';
import { CodeBlock } from './CodeBlock';
import { Divider } from './Divider';

const Row = ({
  label,
  value,
  info,
  hideDivider
}: {
  label: string;
  value: string | ReactNode;
  info?: ReactNode;
  hideDivider?: boolean;
}) => (
  <>
    <Box py="1">
      <Box variant="horizontal-start" sx={{ justifyContent: 'space-between' }}>
        <Body fontWeight="bold">{label}:</Body>
        {typeof value === 'string' ? <Body>{value}</Body> : value}
      </Box>
      {info !== undefined && info}
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
  children: ReactNode;
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

export const TxDetails = ({ tx: { tx, adjustedNonce } }: { tx: TxQueueEntry | TxHistoryEntry }) => {
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
      <Row
        label={translateRaw('NONCE')}
        value={
          <Box variant="horizontal-start">
            <Body>{bigify(tx.nonce).toString()}</Body>{' '}
            {adjustedNonce && <Image ml="2" src={warning} height="20px" width="20px" />}
          </Box>
        }
        info={
          adjustedNonce && <Body color="text.warning">{translateRaw('NONCE_CHANGED_HELP')}</Body>
        }
      />
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

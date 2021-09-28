import { formatEther, formatUnits } from '@ethersproject/units';
import { Body } from '@mycrypto/ui';
import { bigify, translateRaw } from '@signer/common';
import type { TxHistoryEntry, TxQueueEntry } from '@signer/common';

import { CopyableText } from '@components';
import { getChain } from '@data';

import { CodeBlock } from './CodeBlock';
import { Box, ExtendableButton, QR } from './index';
import { TxDetailsBlockRow as BlockRow } from './TxDetailsBlockRow';
import { TxDetailsRow as Row } from './TxDetailsRow';

const isHistoryEntry = (
  transaction: TxQueueEntry | TxHistoryEntry
): transaction is TxHistoryEntry => {
  return !!(transaction as TxHistoryEntry).signedTx;
};

export const TxDetails = ({ tx: entry }: { tx: TxQueueEntry | TxHistoryEntry }) => {
  const { tx, offline } = entry;

  // @todo Type Guard?
  const isEIP1559 = tx.type === 2;

  const gasPrice = isEIP1559 ? tx.maxFeePerGas : tx.gasPrice;
  const chain = getChain(tx.chainId);
  const maxTxFee = bigify(gasPrice).multipliedBy(bigify(tx.gasLimit));
  const symbol = chain?.nativeCurrency?.symbol ?? '?';
  const network = chain?.name ?? translateRaw('UNKNOWN_NETWORK');
  const data = entry.tx.data?.toString() ?? '0x';
  const signedTx = isHistoryEntry(entry) && entry.signedTx;

  return (
    <>
      {offline && signedTx && (
        <ExtendableButton
          title={translateRaw('SHOW_SIGNED_TRANSACTION')}
          extendedTitle={translateRaw('HIDE_SIGNED_TRANSACTION')}
        >
          <CopyableText>{signedTx}</CopyableText>
          {/* @todo: Test how much data can fit into QR */}
          <QR data={signedTx} size="200px" mt="2" mx="auto" display="block" />
        </ExtendableButton>
      )}

      {/** @todo Consider units */}
      <Row label={translateRaw('TX_DETAILS_AMOUNT')} value={`${formatEther(tx.value)} ${symbol}`} />
      <Row label={translateRaw('NETWORK')} value={`${network} (${tx.chainId.toString()})`} />
      <Row label={translateRaw('GAS_LIMIT')} value={bigify(tx.gasLimit).toString()} />
      {isEIP1559 ? (
        <>
          <Row
            label={translateRaw('MAX_FEE')}
            value={`${formatUnits(tx.maxFeePerGas, 'gwei')} Gwei`}
          />
          <Row
            label={translateRaw('MAX_PRIORITY_FEE')}
            value={`${formatUnits(tx.maxPriorityFeePerGas, 'gwei')} Gwei`}
          />
        </>
      ) : (
        <Row label={translateRaw('GAS_PRICE')} value={`${formatUnits(tx.gasPrice, 'gwei')} Gwei`} />
      )}
      <Row
        label={translateRaw('MAX_TX_FEE')}
        value={`${formatEther(maxTxFee.toString())} ${symbol}`}
      />
      <Row
        label={translateRaw('NONCE')}
        value={
          <Box variant="horizontal-start">
            <Body>{bigify(tx.nonce).toString()}</Body>
          </Box>
        }
      />
      {data === '0x' ? (
        <Row label={translateRaw('DATA')} value={translateRaw('TX_DETAILS_DATA_EMPTY')} />
      ) : (
        <BlockRow label={translateRaw('DATA')} hideDivider={true}>
          <CodeBlock>{data}</CodeBlock>
        </BlockRow>
      )}
      {tx.type && tx.type > 0 && <Row label={translateRaw('TX_TYPE')} value={tx.type} />}
    </>
  );
};

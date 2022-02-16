import { formatEther, formatUnits } from '@ethersproject/units';
import { Body } from '@mycrypto/ui';
import { bigify, translateRaw } from '@quill/common';
import type { TxHistoryEntry, TxQueueEntry } from '@quill/common';

import { getChain } from '@data';

import { CodeBlock } from './CodeBlock';
import { Box } from './index';
import { TxDetailsBlockRow as BlockRow } from './TxDetailsBlockRow';
import { TxDetailsRow as Row } from './TxDetailsRow';

export const TxDetails = ({ tx: entry }: { tx: TxQueueEntry | TxHistoryEntry }) => {
  const { tx } = entry;

  const isEIP1559 = tx.type === 2;

  const gasPrice = isEIP1559 ? tx.maxFeePerGas : tx.gasPrice;
  const chain = getChain(tx.chainId);
  const maxTxFee = bigify(gasPrice).multipliedBy(bigify(tx.gasLimit));
  const symbol = chain?.nativeCurrency?.symbol ?? '?';
  const network = chain?.name ?? translateRaw('UNKNOWN_NETWORK');
  const data = entry.tx.data?.toString() ?? '0x';

  return (
    <>
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
